const Joi = require('joi');

const createProductSchema = Joi.object({
    productName: Joi.string().required(),
    iconUrl: Joi.string().pattern(new RegExp('^http.*$')).required(),
    exp: Joi.string().required(),
    code: Joi.string().required(),
    price: Joi.number().required(),
    amount: Joi.number().required(),
    description: Joi.string().allow('').allow(null),
    uses: Joi.string().allow('').allow(null),
    guide: Joi.string().allow('').allow(null),
    termsAndConditions: Joi.string().allow('').allow(null),
    properties: Joi.array().allow(null),
    tags: Joi.array().allow(null)
});

module.exports = createProductSchema;