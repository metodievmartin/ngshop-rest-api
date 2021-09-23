const express = require('express');
const categoriesCtrl = require('../controllers/categoriesController');

const router = express.Router();

// /api/v1/categories
router.route('/')
  .get(categoriesCtrl.getAllCategories)
  .post(categoriesCtrl.createCategory);

// /api/v1/categories/:id
router.route('/:id')
  .get(categoriesCtrl.getCategoryById)
  .delete(categoriesCtrl.deleteCategoryById)

module.exports =router;