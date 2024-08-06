const { body, validationResult } = require('express-validator');

// Validation rules for user-related routes
const userValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('username')
      .isLength({ min: 1 })
      .withMessage('Username is required')
      .matches(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/)
      .withMessage(
        'Username must contain only letters, numbers, and optional underscores, hyphens, or spaces'
      ),
    body('fullName')
      .isLength({ min: 1 })
      .withMessage('Full name is required')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Full name must contain only letters and spaces'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('Password must contain at least one special character'),
  ];
};

// Validation rules for changing passwords
const passwordChangeValidationRules = () => {
  return [
    body('currentPassword')
      .isLength({ min: 8 })
      .withMessage('Current password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage(
        'Current password must contain at least one uppercase letter'
      )
      .matches(/[a-z]/)
      .withMessage(
        'Current password must contain at least one lowercase letter'
      )
      .matches(/[0-9]/)
      .withMessage('Current password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage(
        'Current password must contain at least one special character'
      ),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('New password must contain at least one uppercase letter')
      .matches(/[a-z]/)
      .withMessage('New password must contain at least one lowercase letter')
      .matches(/[0-9]/)
      .withMessage('New password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('New password must contain at least one special character'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  ];
};

const userUpdateValidationRules = () => {
  return [
    body('email')
      .optional()
      .isEmail()
      .withMessage('Enter a valid email address'),
    body('username')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Username is required')
      .matches(/^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/)
      .withMessage(
        'Username must contain only letters, numbers, and optional underscores, hyphens, or spaces'
      ),
    body('fullName')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Full name is required')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Full name must contain only letters and spaces'),
  ];
};

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => {
    return { param: err.param, msg: err.msg };
  });

  return res.status(422).json({
    status: 'fail',
    message: 'Validation failed',
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationRules,
  passwordChangeValidationRules,
  validate,
  userUpdateValidationRules,
};
