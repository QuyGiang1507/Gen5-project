const tokenProvider = require('../tokenProvider');

const getUserId = async (req, res, next) => {
    console.log('object');
    const token = req.headers.authorization;
    
    try {
        if (!token) {
            next();
            console.log("a")
            return;
        }
        console.log("b")
        const identityData = tokenProvider.verify(token);
    
        req.user = identityData.userId;
        next();
    } catch (err) {
        next();
    }
};

module.exports = getUserId;