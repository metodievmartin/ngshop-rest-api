const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({

});

exports.Order = mongoose.model('Order', orderSchema);
