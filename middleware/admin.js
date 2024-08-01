const User = require('../models/admin');
const checkUserJwt = (req, res, next) => {

    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' ,auth:false });
    }

    token = token.replace('Bearer ', '');

    try {
        const decodedToken = User.validateAuthToken(token);
        if(!decodedToken){
        throw new Error('Invalid Token')
        }
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = checkUserJwt;