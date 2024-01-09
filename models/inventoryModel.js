const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema(
    {
        inventoryId: {
            type: String,
            required: [true, "inventory need an id"],
        },
        userId: {
            type: String,
            required: [true, "inventory need an id"],
        },
        name: {
            type: String,
            required: [true, "inventory need an id"],
        },
    },
    {
        timestamps: true,
    }
);

const Inventory = mongoose.model("inventory", inventorySchema);

module.exports = Inventory;