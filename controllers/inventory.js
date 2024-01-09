exports.getInventories = async (req, res, next) => {
    try {
        const result = await Inventory.find({ id: req.user.id });
        res.status(200).json({
            data: result
        });
    } catch (err) {
        res.status(500).json({
            message: "internal server error"
        });
    }
};