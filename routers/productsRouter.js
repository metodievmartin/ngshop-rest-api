const express = require('express');
const productsCtrl = require('../controllers/productsController');

const router = express.Router();

router.get('/', productsCtrl.getAllProducts);

module.exports = router;