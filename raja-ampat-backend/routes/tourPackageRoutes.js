const express = require('express');
const router = express.Router();
const { 
    getPackages, 
    addPackage, 
    updatePackage, 
    deletePackage 
} = require('../controllers/tourPackageController');

// Pastikan handler (getPackages, dll) bukan undefined
router.get('/', getPackages);
router.post('/', addPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;