const jwt = require('jsonwebtoken');

const {
    v4: uuidv4,
} = require('uuid');

const Token = require('../models/accessTokenModel');

require("dotenv").config();

exports.generateRefreshToken = async (user) => {
    const tokenId = uuidv4();
    const token = jwt.sign(
        {
            id: tokenId,
            user,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_LIFETIME
        }
    );
    await Token.create({
        tokenId,
        isUsed: false
    });
    return token;
};

exports.generateToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME });
};

exports.refreshToken = async (token) => {
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET);
        const dbResult = await Token.deleteOne({ tokenId: result.id });
        if (dbResult.deletedCount === 0) {
            return undefined;
        }
        await Token.deleteOne({ tokenId: result.id })
        return {
            refreshToken: await this.generateRefreshToken(result.user),
            token: this.generateToken(result.user)
        }
    } catch (err) {
        console.log(err);
        return undefined;
    }
};