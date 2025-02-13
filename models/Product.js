import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  photos: [{ type: String }],
  category: { type: mongoose.Types.ObjectId, ref: 'Category' },
  features: { type: Object },
  stock: { type: Number, default: 0 }, 
}, {
  timestamps:true,
});

// Prevent model overwrite by checking if it already exists
const Product = models.Product || model('Product', ProductSchema);

export default Product;
