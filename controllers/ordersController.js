const { Order } = require('../models/order');

exports.getAllOrders = async (req, res) =>{
  const orders = await Order.find();

  res.status(200).json(orders);
}