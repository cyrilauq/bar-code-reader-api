const mongoose = require("mongoose");

const inventoryItemSchema = mongoose.Schema(
    {
        inventoryId: {
            type: String,
            required: [true, "inventory need a inventoryId"],
        },
        name: {
            type: String,
            required: [true, "inventory need a name"],
        },
        description: {
            type: String,
            required: [true, "inventory need a description"],
        },
        qty: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const InventoryItems = mongoose.model("inventory-items", inventoryItemSchema);

module.exports = InventoryItems;