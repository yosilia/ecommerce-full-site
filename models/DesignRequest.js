import mongoose from "mongoose";

const DesignRequestSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    phone: { type: String, required: true },

    // ✅ Store `appointmentDate` as a string (YYYY-MM-DD) for easy querying
    appointmentDate: { type: String, required: false },

    // ✅ Add `appointmentTime` to store specific time slots
    appointmentTime: { type: String, required: false }, // e.g., "5:00 PM - 6:00 PM"

    measurements: {
      length: { type: String, required: false },
      width: { type: String, required: false },
      bust: { type: String, required: false },
      waist: { type: String, required: false },
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Declined", "Cancelled"],
      default: "Pending",
    },

    notes: { type: String, required: false },
    image: { type: String, required: false }, // ✅ Ensure image URL is stored as a string
  },
  { timestamps: true } // ✅ Automatically adds `createdAt` and `updatedAt`
);

export default mongoose.models.DesignRequest || mongoose.model("DesignRequest", DesignRequestSchema);
