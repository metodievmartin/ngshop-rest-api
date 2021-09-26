const express = require('express');
const usersCtrl = require('../controllers/usersController');
const authCtrl = require('../controllers/authController');

const router = express.Router();

/*
    /api/v1/users
*/

// Authorization action endpoints - access by everyone
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

router.get(`/`, usersCtrl.getAllUsers);

module.exports = router;