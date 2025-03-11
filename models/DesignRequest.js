import mongoose from "mongoose";

// Define the schema for a design request
const DesignRequestSchema = new mongoose.Schema(
  {
    // Client's name
    clientName: { type: String, required: true },
    
    // Client's email
    clientEmail: { type: String, required: true },
    
    // Client's phone number
    phone: { type: String, required: true },
    
    // Appointment date
    appointmentDate: { type: Date, required: true },
    
    // Appointment time
    appointmentTime: { type: String, required: true },
    
    // Array of image URLs
    images: { type: [String], required: false },
    
    // Measurements for different types of clothing
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
      dressLength: { type: String, required: false },         // Dress Length
      backLength: { type: String, required: false },          // Back Length
      sleeveLength: { type: String, required: false },        // Sleeve Length
      roundSleeve: { type: String, required: false },         // Round Sleeve
      nippleToNipple: { type: String, required: false },      // Nipple to Nipple
      shoulderToNipple: { type: String, required: false },    // Shoulder to Nipple
      halfLength: { type: String, required: false },          // Half Length
      cleavageDepth: { type: String, required: false },       // Cleavage Depth
      blouseLength: { type: String, required: false },        // Blouse Length

      // Skirt & Trouser Measurements
      skirtLength: { type: String, required: false },         // Skirt Length
      trouserLength: { type: String, required: false },       // Trouser Length
      trouserThigh: { type: String, required: false },        // Trouser Thigh
      trouserBottom: { type: String, required: false },       // Trouser Bottom
    },
    
    // Status of the design request
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Declined"],
      default: "Pending",
    },
    
    // Additional notes for the design request
    notes: { type: String, required: false },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Export the DesignRequest model
export default mongoose.models.DesignRequest ||
  mongoose.model("DesignRequest", DesignRequestSchema);
