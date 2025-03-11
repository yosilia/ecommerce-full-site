import mongoose, { Schema, model, models } from 'mongoose';

// Define the schema for the Product model
const ProductSchema = new Schema({
  title: { type: String, required: true }, // Product title, required field
  description: String, // Product description, optional field
  price: { type: Number, required: true }, // Product price, required field
  photos: [{ type: String }], // Array of photo URLs, optional field
  category: { type: mongoose.Types.ObjectId, ref: 'Category' }, // Reference to Category model
  features: { type: Object }, // Product features, stored as an object, optional field
  stock: { type: Number, default: 0 }, // Stock quantity, defaults to 0 if not provided
}, {
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

// Prevent model overwrite by checking if it already exists
const Product = models.Product || model('Product', ProductSchema);

export default Product;
