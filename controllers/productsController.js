const { Product } = require('../models/product');

exports.getAllProducts = async (req, res) => {
  const query = await Product.find();

  res.status(200).json(query);
}