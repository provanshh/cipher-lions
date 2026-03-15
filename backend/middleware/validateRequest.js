import Joi from "joi";

/** Validation schemas for common request bodies */
export const schemas = {
  signup: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  addChild: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    // Allow real emails and internal addresses like name@cipherguard.local
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
  }),
  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(128).required(),
  }),
  blockUrl: Joi.object({
    url: Joi.string().trim().min(1).required(),
    email: Joi.string().email().required(),
  }),
  unblockUrl: Joi.object({
    url: Joi.string().trim().min(1).required(),
    email: Joi.string().email().required(),
  }),
  webUsageFiltered: Joi.object({
    childEmail: Joi.string().email().required(),
    timeFrame: Joi.string().valid("today", "yesterday", "week", "month").optional(),
  }),
};

/** Middleware factory: validate req.body against schema, return 400 on error */
export const validate = (schemaName) => (req, res, next) => {
  const schema = schemas[schemaName];
  if (!schema) return next();
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join("; ");
    return res.status(400).json({ message: "Validation failed", errors: messages });
  }
  req.body = value;
  next();
};
