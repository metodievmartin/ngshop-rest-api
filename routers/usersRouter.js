const express = require('express');
const usersCtrl = require('../controllers/usersController');

const router = express.Router();

router.get(`/`, usersCtrl.getAllUsers);

module.exports = router;