const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "product need a name"],
        },
        weight: {
            type: Number,
            required: [true, "product need a weight"]
        },
        weightUnit: {
            type: String,
            required: [true, "product need a weight's unit"],
        },
        description: {
            type: String,
            required: [true, "product need a description"],
        },
        barcode: {
            type: String,
            required: [true, "product need a barcode"],
            unique: [true, "The barcode of a product must be unique"],
            dropDups: true
        },
    },
    {
        timestamps: true,
    }
);

const Products = mongoose.model("products", productSchema);

module.exports = Products;