const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema(
    {
        tokenId: {
            type: String,
            required: [true, "Token need an id"],
        },
        isUsed: {
            type: Boolean,
            required: [true, "Token need to set isUsed property"],
        },
    },
    {
        timestamps: true,
    }
);

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;