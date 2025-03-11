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
      // Men's Top Measurements
      topLength: { type: String, required: false },           // Top Length
      topBack: { type: String, required: false },             // Top Back
      sleeve: { type: String, required: false },              // Sleeve
      sleeveCircumference: { type: String, required: false }, // Sleeve Circumference
      chest: { type: String, required: false },               // Chest
      waist: { type: String, required: false },               // Waist
      topHip: { type: String, required: false },              // Hip (for tops)
      neck: { type: String, required: false },                // Neck
      
      // Men's Trouser Measurements
      trouserLength: { type: String, required: false },       // Trouser Length
      trouserHip: { type: String, required: false },          // Trouser Hip
      thigh: { type: String, required: false },               // Thigh
      bottom: { type: String, required: false },              // Bottom/Hem

      // Dress & Blouse Measurements
      dressLength: { type: String, required: false },
      backLength: { type: String, required: false },
      sleeveLength: { type: String, required: false },
      roundSleeve: { type: String, required: false },
      nippleToNipple: { type: String, required: false },
      shoulderToNipple: { type: String, required: false },
      halfLength: { type: String, required: false },
      cleavageDepth: { type: String, required: false },
      blouseLength: { type: String, required: false },

      // Skirt & Trouser Measurements
      skirtLength: { type: String, required: false },
      trouserLength: { type: String, required: false },
      trouserThigh: { type: String, required: false },
      trouserBottom: { type: String, required: false },
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
