const AppError = require('../utils/AppError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');


// Middleware function that serves as an auth-guard
exports.authGuard = async (req, res, next) => {
  // 1) Check if there's a token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const fetchedUser = await User.findById(decoded.id);

  if (!fetchedUser) {
    return next(
      new AppError('The user owning this token no longer exists.', 401)
    );
  }

  // 4) Check if user changed password after token was issued
  const isPasswordChangedAfter = await fetchedUser.changedPasswordAfter(decoded.iat);
  if (isPasswordChangedAfter) {
    return next(
      new AppError('Invalid token. User changed password recently. Please log in again.', 401)
    );
  }

  // 5) Add current user's details to the request body
  req.user = fetchedUser;

  // 6) Grant access to the protected route
  next();
};

// Middleware function that protects admin-only routes
exports.adminGuard = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new AppError('You are not authorized to perform this action', 403));
  }

  next();
};

// Receives the roles that have permission to access the resource
// *Must be called only after the 'protect' middleware func for it needs current user details
exports.restrictTo = (...roles) => {
  return (req, res, next) => {

    // If user's current role is not included in the roles arr throw an error
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};