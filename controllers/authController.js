const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { User } = require('../models/user');

const signToken = (id, isAdmin) => {
  return jwt.sign(
    { id, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const createSendToken = (user, statusCode, res) => {
  // Create new signed token
  const token = signToken(user._id);

  // Set values to undefined so that they are not not displayed in the response
  user.password = undefined;
  user.active = undefined;
  user.isAdmin = undefined;

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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password are present
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if user exists && password is correct
  // Explicitly select the password otherwise it will not show up
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything is ok, send the token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  // TODO: Invalidate token

  res.status(200).json({ status: 'success' });
};