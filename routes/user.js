const controller = require("../controllers/user");

const router = require("express").Router();

router.get("/admin/users", controller.getUsers);

module.exports = router;