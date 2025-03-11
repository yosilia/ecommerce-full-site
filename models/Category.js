import mongoose, { Schema, model, models } from 'mongoose';

// Define the schema for the Category model
const CategorySchema = new Schema({
  name: { type: String, required: true }, // Category name, required field
  parent: { type: mongoose.Types.ObjectId, ref: 'Category' }, // Optional parent category, references another Category
  features: [
    {
      name: { type: String },  // Feature name, e.g., "Color"
      values: { type: [String]} // Feature values, e.g., ["White", "Pink", "Green", "Lace"]
    }
  ],
  slug: { type: String, unique: true, required: true }, // Unique slug for the category, required field
  image: { type: String }, // URL or path to the category image
});

// Middleware to automatically create a slug before saving a new category
CategorySchema.pre('save', function (next) {
  if (!this.slug) {
    // Generate slug from the category name
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); 
  }
  next();
});

// Create the Category model if it doesn't already exist
const Category = models.Category || model('Category', CategorySchema);

export default Category;
