import Product from '@/models/Product';
import { mongooseConnect } from '@/lib/mongoose';

// Tokenizer: lowercases, removes punctuation, and splits text
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean);
}

// Jaccard similarity: calculates the overlap between two sets
function jaccardSimilarity(setA, setB) {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Helper function creates a product text from available fields
function getProductText(product) {
  let textParts = [];
  // Always use the title if available
  if (product.title) {
    textParts.push(product.title);
  }
  // Use the description if it's long enough; otherwise, fallback to category or features
  if (product.description && product.description.trim().length > 20) {
    textParts.push(product.description);
  } else if (product.category && product.category.name) {
    textParts.push(product.category.name);
  }
  // Optionally include additional features if provided
  if (product.features && Array.isArray(product.features)) {
    textParts.push(product.features.join(' '));
  }
  return textParts.join(' ');
}

export default async function handler(req, res) {
  const { id } = req.query;
  await mongooseConnect();

  // Fetch the target product and populate category if available
  const targetProduct = await Product.findById(id).populate('category');
  if (!targetProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Retrieve all products; adjust query for performance if needed
  const allProducts = await Product.find({}).populate('category');

  // Build tokenized text for the target product
  const targetText = getProductText(targetProduct);
  const targetTokens = new Set(tokenize(targetText));

  // Compute similarity scores for each product (excluding the target)
  const recommendations = allProducts
    .filter((product) => product.slug.toString() !== id.toString())
    .map((product) => {
      const productText = getProductText(product);
      const productTokens = new Set(tokenize(productText));
      const similarity = jaccardSimilarity(targetTokens, productTokens);
      return { product, similarity };
    });

  // Sort by similarity and pick the top recommendations
  recommendations.sort((a, b) => b.similarity - a.similarity);
  const topRecommendations = recommendations.slice(0, 3).map((rec) => rec.product);

  res.status(200).json(topRecommendations);
}
