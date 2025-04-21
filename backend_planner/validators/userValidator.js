const { body } = require("express-validator");

const validateSignup = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),

  body("email").isEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("dateNaissance").notEmpty().withMessage("Date of birth is required"),

  body("mood").optional(),
  body("motivation").optional(),
];

const validateLogin = [
  body("email").isEmail().withMessage("Invalid email"),

  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  validateSignup,
  validateLogin,
};
