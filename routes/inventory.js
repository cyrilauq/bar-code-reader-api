const Inventory = require('../models/inventoryModel');

const router = require('express').Router();

const controller = require('../controllers/inventory');

router.get('/user/inventories', controller.getInventories);

module.exports = router;