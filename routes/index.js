var express = require("express");
var router = express.Router();
var userController = require("../controllers/user.crtl");

router.post("/user/register", userController.process.signUp);

module.exports = router;