import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;
import slugify from 'slugify';

/* Product schema --------------------------------------------------------- */
const ProductSchema = new Schema(
  {
    title:      { type: String, required: true },
    slug:       { type: String, unique: true, index: true },   // SEO‑friendly URL
    description:{ type: String },
    price:      { type: Number, required: true },
    photos:     [{ type: String }],
    category:   { type: mongoose.Types.ObjectId, ref: 'Category' },
    features:   { type: Object },
    stock:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

/* Export (avoids model overwrite in hot‑reload) --------------------------- */
const Product = models.Product || model('Product', ProductSchema);
export default Product;

