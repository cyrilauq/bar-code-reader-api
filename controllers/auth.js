const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/userModel");
const { HttpStatusCode } = require('axios');
const { refreshToken, generateRefreshToken } = require('../utils/auth');

const {
    v4: uuidv4,
} = require('uuid');

require("dotenv").config();

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
                { email: req.body.email }
            ]
        });

        if (!user) {
            const err = new Error('User Not Found!')
            err.status = 404;
            throw err;
        } else if (await bcrypt.compare(req.body.password, user.password)) {
            const tokenPayload = {
                id: user._id.toString(),
                email: user.email,
            };
            const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME });
            const refreshToken = await generateRefreshToken(user);
            res.status(200).json({
                status: 'success',
                message: 'User Logged In!',
                data: {
                    user: {
                        id: user._id.toString(),
                        name: user.name,
                        firstname: user.firstname,
                        email: user.email,
                        username: user.username
                    },
                    tokens: {
                        accessToken,
                        refreshToken,
                    }
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
        if (await User.findOne({
            email: req.body.email
        })) {
            const err = new Error('Email Taken!')
            err.status = HttpStatusCode.Conflict;
            throw err;
        }

        const user = {
            id: uuidv4(),
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
        if (!err.status) {
            err.status = 500;
        }
        res.status(err.status).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.postRefreshToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.split(' ').lenght !== 2) {
        return res.status(401).json({
            status: 'fail',
            message: 'Authorization missing or incorrect',
        });
    }
    const refreshedToken = await refreshToken(authHeader.split(' ')[1]);
    if (refreshedToken) {
        return res.status(200).json({
            tokens: refreshedToken
        });
    }
    return res.status(401).json({
        message: "Refresh token not valid, re log to access the asked resource",
    });
};