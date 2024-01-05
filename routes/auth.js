const router = require("express").Router();

const controller = require("../controllers/auth");

router.post("/login", controller.postLogin);

router.post("/register", controller.postRegister);

module.exports = router;