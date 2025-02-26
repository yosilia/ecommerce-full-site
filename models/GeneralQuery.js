import mongoose from "mongoose";

const GeneralQuerySchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    message: { type: String, required: true },
    response: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Unread", "In Progress", "Resolved"],
      default: "Unread",
    },
  },
  { timestamps: true }
);

export default mongoose.models.GeneralQuery || mongoose.model("GeneralQuery", GeneralQuerySchema);
