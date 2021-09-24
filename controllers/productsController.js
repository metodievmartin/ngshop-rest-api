const { Product } = require('../models/product');
const { Category } = require('../models/category');

exports.getAllProducts = async (req, res) => {
  const products = await Product.find();

  res.status(200).json(products);
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  const product = await Product
    .findById(productId)
    .populate('category');

  if (!product) {
    return res.status(404).json({
      status: 'failed',
      message: 'A product with this ID could not be found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
};

exports.createProduct = async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid category ID'
    });
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
    return res.status(400).json({
      status: 'failed',
      message: 'Could not create a product'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
};

exports.updateProductById = async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid category ID'
    });
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
    return res.status(404).json({
      status: 'failed',
      message: 'Product with this ID could not be updated'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
};