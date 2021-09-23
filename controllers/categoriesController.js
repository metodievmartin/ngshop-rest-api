const { Category } = require('../models/category');

exports.getAllCategories = async (req, res) =>{
  const categories = await Category.find();

  res.status(200).json(categories);
}