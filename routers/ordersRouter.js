const express = require('express');
const ordersCtrl = require('../controllers/ordersController');

const router = express.Router();

router.get(`/`, ordersCtrl.getAllOrders);

module.exports =router;