const express = require('express');
const categoriesCtrl = require('../controllers/categoriesController');

const router = express.Router();

router.route('/')
  .get(categoriesCtrl.getAllCategories)
  .post(categoriesCtrl.createCategory);

module.exports =router;