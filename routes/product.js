const authenticate = require('../middleware/authenticate');
const authenticateAdmin = require('../middleware/authenticateAdmin');

const router = require('express').Router();

const controller = require('../controllers/product');

router.get('test', authenticate, (req, res) => {
    res.send('hello');
});

router.post("/product", authenticateAdmin, controller.postProduct);

module.exports = router;