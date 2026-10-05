const { body, param } = require("express-validator");
const handleValidation = require("./handleValidation");

function jobListValidator(field, label) {
  return body(field)
    .optional({ checkFalsy: true })
    .isString()
    .withMessage(`${label} must be text`)
    .custom((value) => {
      const items = value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
      if (items.length > 30 || items.some((item) => item.length > 240)) {
        throw new Error(`${label} can contain up to 30 items of 240 characters each`);
      }
      return true;
    });
}

const jobPostValidator = [
  body("title").trim().isLength({ min: 2, max: 140 }).withMessage("Title must be between 2 and 140 characters"),
  body("department").trim().isLength({ min: 2, max: 80 }).withMessage("Department must be between 2 and 80 characters"),
  body("location").trim().isLength({ min: 2, max: 120 }).withMessage("Location must be between 2 and 120 characters"),
  body("type").trim().isLength({ min: 2, max: 80 }).withMessage("Job type must be between 2 and 80 characters"),
  body("experience").trim().isLength({ min: 1, max: 80 }).withMessage("Experience must be no more than 80 characters"),
  body("summary").trim().isLength({ min: 10, max: 400 }).withMessage("Summary must be between 10 and 400 characters"),
  body("order").optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage("Order must be a positive number").toInt(),
  body("active").optional().isBoolean().withMessage("Active must be true or false").toBoolean(),
  jobListValidator("responsibilities", "Responsibilities"),
  jobListValidator("requirements", "Requirements"),
  handleValidation
];

const jobPostIdValidator = [
  param("id").isMongoId().withMessage("Invalid job post id"),
  handleValidation
];

module.exports = { jobPostIdValidator, jobPostValidator };
