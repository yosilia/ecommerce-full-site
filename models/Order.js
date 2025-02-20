import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postcode: String,
    streetAddress: String,
    country: String,
    phone: String,
    paid: Boolean,
}, {
    timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);