const authenticate = require("../middleware/authenticate");
const authenticateAdmin = require("../middleware/authenticateAdmin");

const router = require("express").Router();

router.use(require("./auth"));
router.use(authenticate, require('./product'));
router.use(authenticate, require('./inventory'));
router.use(authenticateAdmin, require('./user'));

module.exports = router;