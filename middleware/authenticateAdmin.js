const jwt = require('jsonwebtoken');

const User = require("../models/userModel");

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized! No header given',
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        const found = await User.findOne({ _id: user.id });
        console.log(found);
        if (!found || !found.roles.includes("admin")) {
            res.status(403).json({
                status: 'fail',
                message: 'Access denied! You don\' have the permissions to access the ressources',
            });
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            status: 'fail',
            message: 'Unauthorized!',
        });
    }
};