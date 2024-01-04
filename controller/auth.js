const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = [];

exports.postLogin = async (req, res, next) => {
    try {
        console.log(req.body.email);
        console.log(JSON.stringify(users));
        const user = users.find(user => user.email === req.body.email);
        if (!user) {
            const err = new Error('User Not Found!')
            err.status = 400;
            throw err;
        } else if (await bcrypt.compare(req.body.password, user.password)) {
            const tokenPayload = {
                email: user.email,
            };
            const accessToken = jwt.sign(tokenPayload, 'SECRET');
            res.status(201).json({
                status: 'success',
                message: 'User Logged In!',
                data: {
                    accessToken,
                },
            });
        } else {
            const err = new Error('Wrong Password!');
            err.status = 400;
            throw err;
        }
    } catch (err) {
        res.status(err.status).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.postRegister = async (req, res, next) => {
    console.log("Register consulted");
    try {
        if (users.some(user => user.email === req.body.email)) {
            const err = new Error('Email Taken!')
            err.status = 400;
            throw err;
        }

        const user = {
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 12),
        }

        users.push(user);

        res.status(201).json({
            status: 'success',
            message: 'User Registered!',
            data: {
                user: {
                    email: user.email,
                },
            },
        });
    } catch (err) {
        console.log(err);
        res.status(err.status).json({
            status: 'fail',
            message: err.message,
        });
    }
};