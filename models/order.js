const mongoose = require('mongoose');
const { Schema } = mongoose;

const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new Schema({
  orderItems: [{
    type: ObjectId,
    ref: 'OrderItem',
    required: [true, 'Please provide order-items']
  }],
  shippingAddress1: {
    type: String,
    required: [true, 'Please provide a shipping address']
  },
  shippingAddress2: {
    type: String,
  },
  city: {
    type: String,
    required: [true, 'Please provide a city']
  },
  zip: {
    type: String,
    required: [true, 'Please provide a zip code']
  },
  country: {
    type: String,
    required: [true, 'Please provide a country']
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  status: {
    type: String,
    required: true,
    default: 'Pending',
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: ObjectId,
    ref: 'User',
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

exports.Order = mongoose.model('Order', orderSchema);
