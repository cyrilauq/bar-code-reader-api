const User = require("../models/userModel");

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            data: users.map(u => ({
                id: u.id,
                email: u.email,
                name: u.name,
                firstname: u.firstname,
                roles: u.roles,
                username: u.username
            }))
        });
    } catch (err) {
        console.log(err);
        res.status(err.status || 500).json({
            status: 'fail',
            message: err.message,
        });
    }
}