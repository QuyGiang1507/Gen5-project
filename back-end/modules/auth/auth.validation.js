const Joi = require('joi');

const signupSchema = Joi.object({
    username: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
    username: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
});

module.exports = {
    signupSchema,
    loginSchema,
}