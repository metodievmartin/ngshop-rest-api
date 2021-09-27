const express = require('express');

const productsCtrl = require('../controllers/productsController');
const { authGuard, adminGuard } = require('../middlewares/guards');

const router = express.Router();

/*
   /api/v1/products
*/

router.route('/')
  .get(productsCtrl.getAllProducts)
  .post(authGuard, adminGuard, productsCtrl.createProduct);

router.route('/:id')
  .get(productsCtrl.getProductById)
  .put(authGuard, adminGuard, productsCtrl.updateProductById)
  .delete(authGuard, adminGuard, productsCtrl.deleteProduct);

router.route('/get/count')
  .get(authGuard, adminGuard, productsCtrl.getProductsCount);


module.exports = router;