const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { User } = require('../models/user');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  // Create new signed token
  const token = signToken(user._id);

  // Set values to undefined so that they are not not displayed in the response
  user.password = undefined;
  user.active = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  // Check for an existing user with the given email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }

  // Create a new user
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  // Send the response containing the newly created user with a signed token
  createSendToken(newUser, 201, res);
});