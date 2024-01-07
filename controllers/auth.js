const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/userModel");

require("dotenv").config()

exports.postLogin = async (req, res, next) => {
    /* 
        #swagger.tags = ['Auth']
        #swagger.description = 'Log the user.'
        #swagger.produces = ['application/json']
        #swagger.parameters['body'] = {
            in: 'body',
            schema: { $ref: '#/components/schemas/Login' }
        }
        #swagger.responses[200] = {
            description: 'The user successfully logged in',
        }
        #swagger.responses[500] = {
            description: 'Server Issue',
        }
        #swagger.responses[404] = {
            description: 'User not found',
        }
        #swagger.responses[400] = {
            description: 'Data incorrectly formatted',
        }
    */
    try {
        const user = await User.findOne({
            $or: [
                { username: req.body.login },
                { email: req.body.login }
            ]
        });

        if (!user) {
            const err = new Error('User Not Found!')
            err.status = 404;
            throw err;
        } else if (await bcrypt.compare(req.body.password, user.password)) {
            const tokenPayload = {
                email: user.email,
            };
            const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET);
            res.status(200).json({
                status: 'success',
                message: 'User Logged In!',
                data: {
                    user: {
                        name: user.name,
                        firstname: user.firstname,
                        email: user.email,
                        username: user.username
                    },
                    accessToken,
                },
            });
        } else {
            const err = new Error('Wrong Password!');
            err.status = 400;
            throw err;
        }
    } catch (err) {
        console.log(err);
        res.status(err.status).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.postRegister = async (req, res, next) => {
    /* 
        #swagger.tags = ['Auth']
        #swagger.description = 'Register the user.'
        #swagger.produces = ['application/json']
        #swagger.parameters['body'] = {
            in: 'body',
            schema: { $ref: '#/components/schemas/User' }
        }
        #swagger.responses[200] = {
            description: 'The user successfully registered',
        }
        #swagger.responses[500] = {
            description: 'Server Issue',
        }
        #swagger.responses[409] = {
            description: 'User already exists',
        }
        #swagger.responses[400] = {
            description: 'Data incorrectly formatted',
        }
    */
    try {
        if (User.find({
            email: req.body.login
        })) {
            const err = new Error('Email Taken!')
            err.status = 400;
            throw err;
        }

        const user = {
            email: req.body.email,
            firstname: req.body.firstname,
            username: req.body.username,
            name: req.body.name,
            password: await bcrypt.hash(req.body.password, 12),
        }

        console.log('Insert user');
        const result = await User.create(user);
        console.log('User inserted');

        res.status(200).json({
            status: 'success',
            message: 'User Registered!',
            data: {
                result,
            },
        });
    } catch (err) {
        res.status(err.status).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.postRefreshToken = (req, res, next) => {

};