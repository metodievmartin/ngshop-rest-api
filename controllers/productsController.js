const multer = require('multer');

const factory = require('../controllers/controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { Product } = require('../models/product');
const { Category } = require('../models/category');

// Allowed MIME Types and their respective file extensions
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
};

// Create image storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new AppError('Invalid image type', 400);

    // If valid MIME Type clear the error passed to the callback function
    if (isValid) uploadError = null;

    // Callback function
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(' ', '-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    // Build uploaded file's full name => file.jpg-1633189651418.jpeg
    const fullName = `${fileName}-${Date.now()}.${extension}`;
    cb(null, fullName);
  }
});

exports.imageUpload = multer({ storage: storage });

exports.getAllProducts = factory.getAll(Product);

exports.getProductById = factory.getOne(Product, {
  path: 'category'
});

exports.createProduct = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(
      new AppError('A product image is required', 400)
    );
  }

  const category = await Category.findById(req.body.category);

  if (!category) {
    return next(
      new AppError('Invalid category ID', 400)
    );
  }

  // Build the url to the file
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  const imageFullPath = `${basePath}${fileName}`;

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    fullDescription: req.body.fullDescription,
    image: imageFullPath,
    images: req.body.images,
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
    );
  }

  const productId = req.params.id;

  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    fullDescription: req.body.fullDescription,
    image: req.body.image,
    images: req.body.images,
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

exports.updateProductsGalleryById = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  // Grab the upload image files
  const files = req.files;

  let imagesPaths = [];

  // Build the base URL
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

  // If images have been uploaded extract each image's full path and push it into imagesPaths array
  if (files) {
    files.map(file => {
      const imageFullPath = `${basePath}${file.filename}`;
      imagesPaths.push(imageFullPath);
    });
  }

  const updatedProduct = {
    images: imagesPaths
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
