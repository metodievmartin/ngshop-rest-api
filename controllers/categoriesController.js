const factory = require('../controllers/controllerFactory');
const { Category } = require('../models/category');


exports.getAllCategories = factory.getAll(Category);

exports.getCategoryById = factory.getOne(Category)

exports.createCategory = factory.createOne(Category);

exports.updateCategoryById = factory.updateOne(Category);

exports.deleteCategoryById = factory.deleteOne(Category);