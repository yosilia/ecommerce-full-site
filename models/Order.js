import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

// Define the schema for the Order model
const OrderSchema = new Schema(
  {
    // Line items in the order
    line_items: Object,
    // Customer's name
    name: String,
    // Customer's email
    email: String,
    // Customer's city
    city: String,
    // Customer's postcode
    postcode: String,
    // Customer's street address
    streetAddress: String,
    // Customer's country
    country: String,
    // Customer's phone number
    phone: String,
    // Payment status of the order
    paid: Boolean,
    // Status of the order
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"], // Allowed values for order status
      default: "Processing", // Default value for order status
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the Order model if it exists, otherwise create it
export default models.Order || model("Order", OrderSchema);
