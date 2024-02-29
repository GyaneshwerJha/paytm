
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const authMiddleware = (req, res, next) => {
    // take token from headers.authorization
    const auth = req.headers.authorization;

    // check if it is there or start with Bearer
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Invalid headers" });
    }

    // split Bearer nd token
    const token = auth.split(' ')[1];

    // verify using jwt.verify
    try {
        const decode = jwt.verify(token, JWT_SECRET);
        req.userId = decode.userId;
        next();
    }
    catch (err) {
        return res.status(403).json({message: "Verification failed"})
    }
};

module.exports = {
    authMiddleware
}