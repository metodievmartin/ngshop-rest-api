const express = require('express');
const usersCtrl = require('../controllers/usersController');
const authCtrl = require('../controllers/authController');
const { authGuard, adminGuard } = require('../middlewares/guards');

const router = express.Router();

/*
    /api/v1/users
*/

// Authorization action endpoints - access by everyone
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.get('/logout', authCtrl.logout);

router.get(`/`, authGuard, adminGuard, usersCtrl.getAllUsers);
router.get(`/get/count`, authGuard, adminGuard, usersCtrl.getUsersCount);

module.exports = router;