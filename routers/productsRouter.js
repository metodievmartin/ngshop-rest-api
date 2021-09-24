const express = require('express');
const productsCtrl = require('../controllers/productsController');

const router = express.Router();

// /api/v1/categories
router.route('/')
  .get(productsCtrl.getAllProducts)
  .post(productsCtrl.createProduct);

// /api/v1/products/:id
router.route('/:id')
  .get(productsCtrl.getProductById);

module.exports = router;