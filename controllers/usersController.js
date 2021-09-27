const { User } = require('../models/user');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) =>{
  const users = await User.find();

  res.status(200).json(users);
});

exports.getUsersCount = catchAsync(async (req, res) => {
  const usersCount = await User.countDocuments();

  res.status(200).json({
    status: 'success',
    count: usersCount
  });
});