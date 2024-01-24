const Product = require("../models/productModel");

const Joi = require('@hapi/joi');
const upload = require('multer')();

const handleFormData = upload.single('file');

const productSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    weight: Joi.number().required(),
    weightUnit: Joi.string().min(1).max(5).required(),
    description: Joi.string().min(5).max(250).required(),
    barcode: Joi.string().min(5).max(50).required()
});

exports.postProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
};

function verifiyObject() {

    return "";
}