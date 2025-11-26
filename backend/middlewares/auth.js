const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) res.status(401).json({
        message: "token not provided",
    });
    //if token is there then we will check
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "INvalid tokoen"
        });

    }
}

module.exports = auth;