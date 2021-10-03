const express = require('express');

const productsCtrl = require('../controllers/productsController');
const { authGuard, adminGuard } = require('../middlewares/guards');

const router = express.Router();

const singleImageUpload = productsCtrl.imageUpload.single('image');
const multipleImagesUpload = productsCtrl.imageUpload.array('images', 10);

/*
   /api/v1/products
*/

router.route('/')
  .get(productsCtrl.getAllProducts)
  .post(authGuard, adminGuard, singleImageUpload, productsCtrl.createProduct);

router.route('/:id')
  .get(productsCtrl.getProductById)
  .put(authGuard, adminGuard, productsCtrl.updateProductById)
  .delete(authGuard, adminGuard, productsCtrl.deleteProduct);

router.route('/get/count')
  .get(authGuard, adminGuard, productsCtrl.getProductsCount);

router.route('/gallery-images/:id')
  .put(authGuard, adminGuard, multipleImagesUpload, productsCtrl.updateProductsGalleryById);

module.exports = router;