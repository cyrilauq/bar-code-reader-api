const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema(
    {
        inventoryId: {
            type: String,
            required: [true, "inventory need an id"],
        },
        isUsed: {
            type: Boolean,
            required: [true, "inventory need to set isUsed property"],
        },
    },
    {
        timestamps: true,
    }
);

const Inventory = mongoose.model("inventory", inventorySchema);

module.exports = Inventory;