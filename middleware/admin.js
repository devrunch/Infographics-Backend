const User = require('../models/admin');
const checkUserJwt = (req, res, next) => {
    const token = req.cookies["infojwttoken"]
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' ,auth:false });
    }
    try {
        const decodedToken = User.validateAuthToken(token);
        req.user = decodedToken;
        console.log("Auth")
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = checkUserJwt;