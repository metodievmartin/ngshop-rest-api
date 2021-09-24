const express = require('express');
const productsCtrl = require('../controllers/productsController');

const router = express.Router();

router.route('/')
  .get(productsCtrl.getAllProducts)
  .post(productsCtrl.createProduct);

module.exports = router;