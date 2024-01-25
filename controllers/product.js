const { HttpStatusCode } = require("axios");
const Product = require("../models/productModel");

const Joi = require('@hapi/joi');
const upload = require('multer')();

const fs = require('node:fs');

const handleFormData = upload.single('file');

const productSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    weight: Joi.number().required(),
    weightUnit: Joi.string().min(1).max(5).required(),
    description: Joi.string().min(5).max(250).required(),
    barcode: Joi.string().min(5).max(50).required()
});

exports.postProduct = async (req, res, next) => {
    const data = { ...req.body, file: req.files[0] };
    const { error } = productSchema.validate(req.body);
    const product = await Product.findOne({ barcode: data.barcode })

    if (error) {
        return res.status(HttpStatusCode.BadRequest).json({ message: error.details[0].message });
    }
    if (product) {
        return res.status(HttpStatusCode.Conflict).json({ message: "Product with the given barcode already exist" })
    }
    try {
        fs.writeFileSync("./image/" + data.barcode + ".png", data.file.buffer, { flag: "w+" });
        Product.create({
            name: data.name,
            weight: data.weight,
            weightUnit: data.weightUnit,
            description: data.description,
            barcode: data.barcode,
            imagePath: (process.env.NODE_ENV === "production" ? "https://bar-code-reader-api.onrender.com/" : "http://localhost:3300/") + "image/" + data.barcode + ".png"
        });
        res.status(HttpStatusCode.Ok).json({ message: "Product sucessfully added" });
    } catch (err) {
        console.log(err);
        res.status(HttpStatusCode.InternalServerError).json({ message: "AN internal servor error occured" });
    }
};