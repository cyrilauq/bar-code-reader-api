const authenticate = require("../middleware/authenticate");
const authenticateAdmin = require("../middleware/authenticateAdmin");

const router = require("express").Router();

const multer = require('multer');
const storage = multer.memoryStorage(); // You can customize storage as needed
const upload = multer({ storage: storage });

router.use(require("./auth"));
router.use(authenticate, upload.any(), require('./product'));
router.use(authenticate, require('./inventory'));
router.use(authenticateAdmin, require('./user'));

module.exports = router;