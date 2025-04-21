const express = require("express");
const router = express.Router();
const { signUp } = require("../controllers/userController");
const { login } = require("../controllers/authController");

const {
  validateSignup,
  validateLogin,
} = require("../validators/userValidator");
const handleValidation = require("../middlewares/validationResultHandler");

router.post("/signup", validateSignup, handleValidation, signUp);
router.post("/login", validateLogin, handleValidation, login);

module.exports = router;
