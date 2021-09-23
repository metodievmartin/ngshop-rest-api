const { Category } = require('../models/category');

exports.getAllCategories = async (req, res) => {
  const categories = await Category.find();

  res.status(200).json(categories);
};

exports.getCategoryById = async (req, res) => {
  const categoryId = req.params.id;

  const category = await Category.findById(categoryId);

  if (!category) {
    return res.status(404).json({
      status: 'failed',
      message: 'Category with this ID could not be found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
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

exports.updateCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  const { name, icon, colour } = req.body;

  const updatedCategory = {
    name,
    icon,
    colour
  };

  const category = await Category
    .findByIdAndUpdate(categoryId, updatedCategory, { new: true });

  if (!category) {
    return res.status(404).json({
      status: 'failed',
      message: 'Category with this ID could not be updated'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
};

exports.deleteCategoryById = async (req, res) => {
  const categoryId = req.params.id;

  const removedCategory = await Category.findByIdAndRemove(categoryId);

  if (!removedCategory) {
    return res.status(404).json({
      status: 'failed',
      message: 'Category could not be removed'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      category: removedCategory
    }
  });
};