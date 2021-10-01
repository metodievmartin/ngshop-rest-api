const mongoose = require('mongoose');
const { Schema } = mongoose;

const ObjectId = mongoose.Schema.Types.ObjectId;

const orderItemSchema = new Schema({
  quantity: {
    type: Number,
    required: true
  },
  product: {
    type: ObjectId,
    ref: 'Product',
    required: true
  },
});

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);