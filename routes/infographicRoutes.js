const express = require('express');
const infographicController = require('../controllers/infographicController');
const router = express.Router();

// Upload Infographic
router.post('/upload', infographicController.uploadMiddleware, infographicController.uploadInfographic);

// Get all Infographics
router.get('/', infographicController.getAllInfographics);
router.get('/all', infographicController.getAllInfographics1);
router.get('/tags', infographicController.allAvailbleTags);
router.get('/search', infographicController.searchInfographics);
router.get('/:id', infographicController.getInfographic);
router.post('/:id/download', infographicController.downloadInfographic);
// Update Infographic
router.patch('/:id',  infographicController.updateInfographic);
// Delete Infographic
router.delete('/:id', infographicController.deleteInfographic);

module.exports = router;
