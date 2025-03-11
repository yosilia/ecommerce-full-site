import mongoose from "mongoose";

// Define the schema for GeneralQuery
const GeneralQuerySchema = new mongoose.Schema(
  {
    // Name of the client
    clientName: { type: String, required: true },
    // Email of the client
    clientEmail: { type: String, required: true },
    // Message from the client
    message: { type: String, required: true },
    // Response to the client's message
    response: { type: String, default: "" },
    // Status of the query
    status: {
      type: String,
      enum: ["Unread", "In Progress", "Resolved"], // Allowed values for status
      default: "Unread", // Default status
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Export the model, or if it already exists, use the existing model
export default mongoose.models.GeneralQuery || mongoose.model("GeneralQuery", GeneralQuerySchema);
