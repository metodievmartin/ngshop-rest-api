const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String },
  image: { type: String },
  countInStock: { type: Number },
});

exports.Product = mongoose.model('Product', productSchema);