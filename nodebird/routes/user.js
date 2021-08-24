const express = require("express");

const { isLoggedIn } = require("./middlewares");
const User = require("../models/user");
const { addFollowing } = require("../controllers/user");
const router = express.Router();

router.post("/:id/follow", isLoggedIn, addFollowing);
//controller로 따로 모듈화 시킴.
module.exports = router;
