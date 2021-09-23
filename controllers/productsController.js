const { Product } = require('../models/product');

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();

  res.status(200).json(products);
}