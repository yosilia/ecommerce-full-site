import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  city: { type: String },
  country: { type: String },
  streetAddress: { type: String },
  postcode: { type: String },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
