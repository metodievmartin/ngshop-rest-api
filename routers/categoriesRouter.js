const express = require('express');
const categoriesCtrl = require('../controllers/categoriesController');

const router = express.Router();

router.get(`/`, categoriesCtrl.getAllCategories);

module.exports =router;