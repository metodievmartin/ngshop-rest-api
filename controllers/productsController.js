const factory = require('../controllers/controllerFactory');
const catchAsync = require('../utils/catchAsync');
const { Product } = require('../models/product');
const { Category } = require('../models/category');
const AppError = require('../utils/AppError');

exports.getAllProducts = factory.getAll(Product);

exports.getProductById = factory.getOne(Product, {
  path: 'category'
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return next(
      new AppError('Invalid category ID', 400)
    );
  }

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    fullDescription: req.body.fullDescription,
    image: req.body.image,
    images:req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) {
    return next(new AppError('No product found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

exports.updateProductById = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return next(
      new AppError('Invalid category ID', 400)
    )
  }

  const productId = req.params.id;

  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    fullDescription: req.body.fullDescription,
    image: req.body.image,
    images:req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  };

  const product = await Product
    .findByIdAndUpdate(productId, updatedProduct, { new: true });

  if (!product) {
    return next(new AppError('No product found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

exports.deleteProduct = factory.deleteOne(Product);

exports.getProductsCount = factory.getCount(Product);
