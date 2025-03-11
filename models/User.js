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

  // Add measurements to persist updates from admin or user
  measurements: {
    bust: { type: String },
    length: { type: String },
    width: { type: String },
    waist: { type: String },
    hips: { type: String },
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
