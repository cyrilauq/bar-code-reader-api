const Inventory = require('../models/inventoryModel');

const router = require('express').Router();

const controller = require('../controllers/inventory');

router.get('/user/inventories', controller.getInventories);
router.get('/user/inventory/:inventoryId', controller.getInventory);
router.post('/user/inventories', controller.addInventory);

module.exports = router;