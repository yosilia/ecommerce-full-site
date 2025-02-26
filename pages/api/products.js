import Product from '@/models/Product';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminValid } from '@/pages/api/auth/[...nextauth]';
import mongoose from 'mongoose'; // ✅ Import to check ObjectId validity

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminValid(req, res);

  if (method === 'GET') {
    try {
      if (req.query?.id) {
        const product = await Product.findOne({ _id: req.query.id });
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        return res.json(product);
      }
      return res.json(await Product.find());
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  if (method === 'POST') {
    try {
      const { title, description, price, photos, category, features, stock } = req.body;

      // ✅ Check for Missing Fields
      if (!title || !description || !price || !category || !photos.length) {
        return res.status(400).json({
          error: "All fields (title, description, price, category, photos) are required.",
        });
      }

      // ✅ Ensure category is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ error: "Invalid category selected." });
      }

      // ✅ Create Product
      const productDoc = await Product.create({
        title,
        description,
        price,
        photos,
        category,
        features,
        stock,
      });

      return res.status(201).json(productDoc);
    } catch (error) {
      console.error("Error saving product:", error);
      return res.status(500).json({ error: "Internal server error. Please try again." });
    }
  }

  if (method === 'PUT') {
    try {
      const { title, description, price, photos, category, features, stock, _id } = req.body;

      // ✅ Validate if product exists
      const existingProduct = await Product.findById(_id);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found." });
      }

      // ✅ Ensure category is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ error: "Invalid category selected." });
      }

      await Product.updateOne(
        { _id },
        { title, description, price, photos, category, features, stock }
      );

      return res.status(200).json({ message: "Product updated successfully!" });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ error: "Failed to update product." });
    }
  }

  if (method === 'DELETE') {
    try {
      if (!req.query?.id) {
        return res.status(400).json({ error: "Product ID is required for deletion." });
      }

      const deletedProduct = await Product.findByIdAndDelete(req.query.id);

      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found." });
      }

      return res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete product." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
