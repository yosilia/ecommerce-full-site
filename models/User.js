import mongoose from "mongoose";

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's name
  email: { type: String, required: true, unique: true }, // User's email, must be unique
  password: { type: String, required: true }, // User's password
  phone: { type: String }, // User's phone number
  city: { type: String }, // User's city
  country: { type: String }, // User's country
  streetAddress: { type: String }, // User's street address
  postcode: { type: String }, // User's postcode
});

// Export the User model
export default mongoose.models.User || mongoose.model("User", UserSchema);
