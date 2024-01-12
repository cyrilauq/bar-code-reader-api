const Inventory = require('../models/inventoryModel');

exports.getInventories = async (req, res, next) => {
    try {
        const result = await Inventory.find({ userId: req.user.id });
        res.status(200).json({
            data: result.map(i => ({ id: i._id, userId: i.userId, name: i.name }))
        });
    } catch (err) {
        res.status(500).json({
            message: "internal server error"
        });
    }
};

exports.addInventory = async (req, res, next) => {
    const data = req.body;
    if (!data.name || data.name.trim().length === 0) {
        res.status(400).json({
            message: "Inventory must have a name"
        });
        return;
    }
    if (!data.description || data.description.trim().length === 0) {
        res.status(400).json({
            message: "Inventory must have a description"
        });
        return;
    }
    const result = await Inventory.find({
        $and: [
            { name: data.name },
            { userId: req.user.id }
        ]
    });
    if (result.length > 0) {
        res.status(400).json({
            message: "Inventory's name must be unique."
        });
        return;
    }
    try {
        const result = await Inventory.create({
            name: data.name,
            userId: req.user.id,
            description: data.description
        });
        res.status(200).json({
            message: "Inventory added!",
            data: result
        });
        return;
    } catch (err) {
        if (!err.status) {
            err.status = 500;
        }
        res.status(err.status).json({
            status: 'fail',
            message: err.message,
        });
        return;
    }
};