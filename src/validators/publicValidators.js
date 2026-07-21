const { body } = require("express-validator");
const handleValidation = require("./handleValidation");

const contactValidator = [
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
    .isLength({ max: 120 })
    .withMessage("Email must be no more than 120 characters")
    .normalizeEmail(),
  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 6, max: 40 })
    .withMessage("Phone must be between 6 and 40 characters"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters"),
  body("productCategories")
    .optional({ checkFalsy: true })
    .customSanitizer((value) => (Array.isArray(value) ? value : [value]))
    .custom((values) => values.every((value) => String(value).length <= 120))
    .withMessage("Please select valid product categories"),
  handleValidation
];

const enquiryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Mobile is required")
    .isLength({ min: 6, max: 40 })
    .withMessage("Mobile must be between 6 and 40 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .isLength({ max: 120 })
    .withMessage("Email must be no more than 120 characters")
    .normalizeEmail(),
  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ max: 80 })
    .withMessage("City must be no more than 80 characters"),
  body("product")
    .trim()
    .notEmpty()
    .withMessage("Product is required")
    .isLength({ max: 120 })
    .withMessage("Please select a valid product"),
  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required")
    .isLength({ max: 40 })
    .withMessage("Please select a valid quantity"),
  body("unit")
    .trim()
    .notEmpty()
    .withMessage("Unit is required")
    .isLength({ max: 40 })
    .withMessage("Please select a valid unit"),
  body("application")
    .trim()
    .notEmpty()
    .withMessage("Application is required")
    .isLength({ max: 120 })
    .withMessage("Please select a valid application"),
  body("comments")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comments must be no more than 1000 characters"),
  handleValidation
];

const productEnquiryValidator = [
  body("product")
    .trim()
    .notEmpty()
    .withMessage("Product is required")
    .isLength({ max: 160 })
    .withMessage("Product must be no more than 160 characters"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 6, max: 40 })
    .withMessage("Phone must be between 6 and 40 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .isLength({ max: 120 })
    .withMessage("Email must be no more than 120 characters")
    .normalizeEmail(),
  body("city")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 80 })
    .withMessage("City must be no more than 80 characters"),
  body("message")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Requirement must be no more than 1000 characters"),
  handleValidation
];

const catalogueLeadValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .isLength({ max: 120 })
    .withMessage("Email must be no more than 120 characters")
    .normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 6, max: 40 })
    .withMessage("Phone must be between 6 and 40 characters"),
  body("company")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 120 })
    .withMessage("Company must be no more than 120 characters"),
  body("city")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 80 })
    .withMessage("City must be no more than 80 characters"),
  body("interestedCatalogue")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 120 })
    .withMessage("Interested catalogue must be no more than 120 characters"),
  handleValidation
];

module.exports = {
  catalogueLeadValidator,
  contactValidator,
  enquiryValidator,
  productEnquiryValidator
};
