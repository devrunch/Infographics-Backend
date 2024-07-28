const express = require('express');
const infographicController = require('../controllers/infographicController');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to check user JWT
const checkUserJwt = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' ,auth:false });
    }
    try {
        const decodedToken = jwt.verify(token, 'your_secret_key');
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Use the middleware in the routes

// Upload Infographic
router.get('admin/auth',checkUserJwt, (req, res) => { res.status(200).json({ message: 'Authorized',auth:true }); });
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
