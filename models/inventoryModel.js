const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "inventory need a userId"],
        },
        name: {
            type: String,
            required: [true, "inventory need a name"],
        },
        description: {
            type: String,
            required: [true, "inventory need a description"],
        },
    },
    {
        timestamps: true,
    }
);

const Inventory = mongoose.model("inventory", inventorySchema);

module.exports = Inventory;