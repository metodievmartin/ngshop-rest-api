const factory = require('../controllers/controllerFactory');
const { User } = require('../models/user');

exports.getAllUsers = factory.getAll(User);

exports.getUserById = factory.getOne(User);

exports.createUser = factory.createOne(User);

exports.updateUserById = factory.updateOne(User);

exports.deleteUserById = factory.deleteOne(User);

exports.getUsersCount = factory.getCount(User);