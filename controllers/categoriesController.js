const { Category } = require('../models/category');

exports.getAllCategories = async (req, res) =>{
  const categories = await Category.find();

  res.status(200).json(categories);
};

exports.createCategory = async (req, res) => {
  const { name, icon, colour } = req.body;

  let newCategory = new Category({
    name,
    icon,
    colour
  });

  newCategory = await newCategory.save();

  if (!newCategory) {
    return res.status(400).json({
      status: 'failed',
      message: 'Category could not be created'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      category: newCategory
    }
  });
};