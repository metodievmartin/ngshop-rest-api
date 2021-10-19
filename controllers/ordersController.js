const factory = require('../controllers/controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');

const orderPopulateOptions = [
  {
    path: 'orderItems',
    populate: {
      path: 'product',
      populate: {
        path: 'category'
      }
    },
  },
  {
    path: 'user'
  }
];
exports.getAllOrders = factory.getAll(Order, orderPopulateOptions);

exports.getOrderById = factory.getOne(Order, orderPopulateOptions);

exports.createOrder = catchAsync(async (req, res, next) => {

  // Create a new OrderItem for each ordered product
  // and map it into a new array of OrderItem IDs
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product
      });

      newOrderItem = await newOrderItem.save();

      // Return OrderItem's ID
      return newOrderItem._id;
    })
  );

  // Resolve the promise
  const orderItemsIdsResolved = await orderItemsIds;

  // Create an array of each OrderItem's total price
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      // Query and populate each OrderItem to get the price
      const orderItem = await OrderItem
        .findById(orderItemId)
        .populate('product', 'price');

      // Return the total price of the current OrderItem
      return orderItem.product.price * orderItem.quantity;
    })
  );

  // Calculate the total price of the Order by reducing the OrderItems total prices
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  // Create new Order
  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order = await order.save();

  if (!order) {
    return next(
      new AppError('The order could not be created!', 400)
    );
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});

exports.updateOrderById = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const updatedOrder = {
    status
  };

  const order = await Order
    .findByIdAndUpdate(orderId, updatedOrder, { new: true });

  if (!order) {
    return next(
      new AppError('Could not find an order with this ID', 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});

exports.deleteOrderById = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;

  const order = await Order
    .findByIdAndRemove(orderId);

  if (!order) {
    return next(
      new AppError('Could not find an order with this ID', 404)
    );
  }

  // If such order exists loop through the OrderItem array and delete each item related to that order
  order.orderItems.map(async orderItemId => {
    await OrderItem.findByIdAndRemove(orderItemId);
  });

  res.status(200).json({
    status: 'success',
    data: null
  });
});

exports.getTotalSales = catchAsync(async (req, res, next) => {
  const totalSales = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$totalPrice' }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: totalSales.pop().total
  });
});

exports.getOrdersCount = factory.getCount(Order);