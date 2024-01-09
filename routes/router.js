const authenticate = require("../middleware/authenticate");

const router = require("express").Router();

router.use(require("./auth"));
router.use(authenticate, require('./product'));
router.use(authenticate, require('./inventory'));

module.exports = router;