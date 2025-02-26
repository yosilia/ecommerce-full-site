import mongoose from "mongoose";

const DesignRequestSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    phone: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    images: { type: [String], required: false },
    measurements: {
      length: { type: String, required: false },
      width: { type: String, required: false },
      bust: { type: String, required: false },
      waist: { type: String, required: false },
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Declined"],
      default: "Pending",
    },
    notes: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.DesignRequest ||
  mongoose.model("DesignRequest", DesignRequestSchema);
