const express = require('express');
const infographicController = require('../controllers/infographicController');
const User = require('../models/admin');
const checkUserJwt = require('../middleware/admin');
const router = express.Router();

router.post('/upload',checkUserJwt, infographicController.uploadMiddleware, infographicController.uploadInfographic);
// Get all Infographics
router.get('/', infographicController.getAllInfographics);
router.get('/all', infographicController.getAllInfographics1);

router.get('/categories', infographicController.categoryInfographics);
router.get('/tags', infographicController.allAvailbleTags);
router.get('/search', infographicController.searchInfographics);
router.get('/:id', infographicController.getInfographic);
router.post('/:id/download', infographicController.downloadInfographic);
router.post('/:id',checkUserJwt, infographicController.updateInfographic);
router.delete('/:id',checkUserJwt, infographicController.deleteInfographic);
router.get('/clearcache',checkUserJwt, infographicController.clearCache);   
// Update Infographic
// Delete Infographic

module.exports = router;
