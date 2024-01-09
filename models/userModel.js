const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "Please give an id"],
        },
        name: {
            type: String,
            required: [true, "Please enter a name"],
        },
        firstname: {
            type: String,
            required: [true, "Please enter a firstname"],
        },
        username: {
            type: String,
            required: [true, "Please enter a username"],
        },
        email: {
            type: String,
            required: [true, "Please enter a email"],
        },
        password: {
            type: String,
            required: [true, "Please enter a password"],
        },
        image: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;