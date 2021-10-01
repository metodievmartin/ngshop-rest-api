const express = require('express');
const ordersCtrl = require('../controllers/ordersController');
const { authGuard, adminGuard } = require('../middlewares/guards');

const router = express.Router();

// All routes require authentication & authorization to get access
router.use(authGuard, adminGuard);

router.route('/')
  .get(ordersCtrl.getAllOrders)
  .post(ordersCtrl.createOrder);

router.route('/:id')
  .get(ordersCtrl.getOrderById)
  .put(ordersCtrl.updateOrderById)
  .delete(ordersCtrl.deleteOrderById);

router.route('/get/total-sales')
  .get(ordersCtrl.getTotalSales)

module.exports =router;