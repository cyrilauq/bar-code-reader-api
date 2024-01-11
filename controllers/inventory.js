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