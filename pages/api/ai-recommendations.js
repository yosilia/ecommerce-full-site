import natural from 'natural';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { mongooseConnect } from '@/lib/mongoose';

// Build product text profile from available fields.
function getProductText(product) {
  let textParts = [];
  if (product.title) textParts.push(product.title);
  if (product.description && product.description.trim().length > 20) {
    textParts.push(product.description);
  }
  if (product.features && Array.isArray(product.features)) {
    textParts.push(product.features.join(' '));
  }
  return textParts.join(' ');
}

// Build TF-IDF vectors for all products.
function buildTfIdf(products) {
  const tfidf = new natural.TfIdf();
  products.forEach(product => {
    tfidf.addDocument(getProductText(product));
  });
  return tfidf;
}

// For a given document index, return a term vector as an object mapping term->weight.
function getDocumentVector(tfidf, docIndex) {
  const vector = {};
  tfidf.listTerms(docIndex).forEach(item => {
    vector[item.term] = item.tfidf;
  });
  return vector;
}

// Compute cosine similarity between two term vectors.
function cosineSimilarity(vecA, vecB) {
  // Get the intersection of terms.
  const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;
  allTerms.forEach(term => {
    const a = vecA[term] || 0;
    const b = vecB[term] || 0;
    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  });
  return (magA && magB) ? dotProduct / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

export default async function handler(req, res) {
  // Expect query parameters: productId (current product) and optionally userEmail for collaborative filtering.
  const { productId, userEmail } = req.query;
  await mongooseConnect();

  // ---------- Content-Based Filtering using TF-IDF ----------
  const allProducts = await Product.find({});
  const currentIndex = allProducts.findIndex(p => p._id.toString() === productId);
  if (currentIndex === -1) return res.status(404).json({ error: 'Product not found' });

  // Build the TF-IDF model.
  const tfidf = buildTfIdf(allProducts);

  // Get vector for the current product.
  const currentVector = getDocumentVector(tfidf, currentIndex);

  // Calculate cosine similarity for each product (excluding the current product).
  const contentScores = allProducts.map((product, index) => {
    if (index === currentIndex) return { product, score: 0 };
    const vector = getDocumentVector(tfidf, index);
    const score = cosineSimilarity(currentVector, vector);
    return { product, score };
  });

  // ---------- Collaborative Filtering using Order Data ----------
  let collaborativeScores = [];
  if (userEmail) {
    // Retrieve orders for the user.
    const userOrders = await Order.find({ email: userEmail, paid: true });
    const userProductIds = new Set();
    userOrders.forEach(order => {
      Object.keys(order.line_items || {}).forEach(prodId => userProductIds.add(prodId));
    });

    // For each purchased product, find other orders by other users containing the same product.
    let productFrequency = {};
    for (const purchasedProdId of userProductIds) {
      const relatedOrders = await Order.find({
        email: { $ne: userEmail },
        paid: true,
        [`line_items.${purchasedProdId}`]: { $exists: true },
      });
      relatedOrders.forEach(order => {
        Object.keys(order.line_items || {}).forEach(otherProdId => {
          // Exclude products already purchased and the current product.
          if (!userProductIds.has(otherProdId) && otherProdId !== productId) {
            productFrequency[otherProdId] = (productFrequency[otherProdId] || 0) + 1;
          }
        });
      });
    }
    // Fetch product details for these recommendations.
    const recommendedIds = Object.keys(productFrequency);
    const collabProducts = await Product.find({ _id: { $in: recommendedIds } });
    collaborativeScores = collabProducts.map(prod => ({
      product: prod,
      score: productFrequency[prod._id.toString()],
    }));
  }

  // ---------- Combine Recommendations ----------
  // Combine the content-based and collaborative scores (adjust weights as needed).
  const combinedMap = new Map();
  contentScores.forEach(rec => {
    combinedMap.set(rec.product._id.toString(), rec.score);
  });
  collaborativeScores.forEach(rec => {
    const prodId = rec.product._id.toString();
    const existing = combinedMap.get(prodId) || 0;
    combinedMap.set(prodId, existing + rec.score);
  });

  // Convert the map to an array and sort by combined score (highest first).
  let combinedArray = [];
  for (const [prodId, score] of combinedMap.entries()) {
    const prod = allProducts.find(p => p._id.toString() === prodId);
    if (prod) combinedArray.push({ product: prod, score });
  }
  combinedArray.sort((a, b) => b.score - a.score);
  const topRecommendations = combinedArray.slice(0, 3).map(r => r.product);

  res.status(200).json(topRecommendations);
}
