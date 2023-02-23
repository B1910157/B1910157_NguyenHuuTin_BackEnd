const express = require("express");
const login = require("../controllers/user.controller");


const router = express.Router();

router.route("/")
    .post(login.findUser)

module.exports = router;