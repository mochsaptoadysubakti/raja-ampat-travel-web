// routes/tourPackageRoutes.js
const express = require('express');
const router = express.Router();
const { getPackages, getSinglePackage } = require('../controllers/tourPackageController');

router.get('/', getPackages);
router.get('/:id', getSinglePackage);

module.exports = router;