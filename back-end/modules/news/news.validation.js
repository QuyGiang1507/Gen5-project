const Joi = require('joi');

const createNewsSchema = Joi.object({
    title: Joi.string().required(),
    sapo: Joi.string().required().max(256),
    iconUrl: Joi.string().pattern(new RegExp('^http.*$')).required(),
    content: Joi.string().required(),
    properties: Joi.array().allow(null),
});

module.exports = createNewsSchema;