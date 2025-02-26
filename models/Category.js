import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: 'Category' }, // Optional parent category
  features: [
    {
      name: { type: String },  // e.g., "Color"
      values: { type: [String]} // e.g., ["White", "Pink", "Green", "Lace"]
    }
  ],
  slug: { type: String, unique: true, required: true }, // ✅ Ensure slug is required
  image: { type: String }, // Category image URL or path
});

// Automatically create a slug before saving a new category
CategorySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); 
  }
  next();
});

const Category = models.Category || model('Category', CategorySchema);

export default Category;
