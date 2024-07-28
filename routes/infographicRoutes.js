const express = require('express');
const infographicController = require('../controllers/infographicController');
const User = require('../models/admin');
const checkUserJwt = require('../middleware/admin');
const router = express.Router();

// Middleware to check user JW

// Use the middleware in the routes

// Upload Infographic
router.post('/upload',checkUserJwt, infographicController.uploadMiddleware, infographicController.uploadInfographic);

// Get all Infographics
router.get('/', infographicController.getAllInfographics);
router.get('/all', infographicController.getAllInfographics1);

router.get('/categories', infographicController.categoryInfographics);
router.get('/tags', infographicController.allAvailbleTags);
router.get('/search', infographicController.searchInfographics);
router.get('/:id', infographicController.getInfographic);
router.post('/:id/download',checkUserJwt, infographicController.downloadInfographic);
router.post('/:id',checkUserJwt, infographicController.updateInfographic);
router.delete('/:id',checkUserJwt, infographicController.deleteInfographic);

// Update Infographic
// Delete Infographic

module.exports = router;
