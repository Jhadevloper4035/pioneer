const { body } = require("express-validator");
const {
  isE164MobileNumber,
  isStrongPassword
} = require("../utils/authValidators");
const handleValidation = require("./handleValidation");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),
  body("mobileNumber")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .custom((value) => {
      if (!isE164MobileNumber(value)) {
        throw new Error("Mobile number must be in E.164 format, for example +919876543210");
      }

      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .custom((value) => {
      if (!isStrongPassword(value)) {
        throw new Error(
          "Password must be at least 10 characters and include uppercase, lowercase, number, and symbol"
        );
      }

      return true;
    }),
  handleValidation
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  handleValidation
];

module.exports = {
  loginValidator,
  registerValidator
};
