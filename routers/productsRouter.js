const express = require('express');
const productsCtrl = require('../controllers/productsController');

const router = express.Router();

// /api/v1/categories
router.route('/')
  .get(productsCtrl.getAllProducts)
  .post(productsCtrl.createProduct);

// /api/v1/products/:id
router.route('/:id')
  .get(productsCtrl.getProductById)
  .put(productsCtrl.updateProductById);

// /api/v1/products/get/count
router.route('/get/count')
  .get(productsCtrl.getProductsCount);

// /api/v1/products/get/featured
router.route('/get/featured')
  .get(productsCtrl.getFeaturedProducts)

module.exports = router;