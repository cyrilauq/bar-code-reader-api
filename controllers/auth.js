const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = [];

exports.postLogin = async (req, res, next) => {
    /* 
        #swagger.tags = ['Auth']
        #swagger.description = 'Login the user.'
        #swagger.consumes = ['application/json']
        #swagger.produces = ['application/json']
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
            res.status(200).json({
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
    /* 
        #swagger.tags = ['Auth']
        #swagger.description = 'Register the user.'
        #swagger.consumes = ['application/json']
        #swagger.produces = ['application/json']
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