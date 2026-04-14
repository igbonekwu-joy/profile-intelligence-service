const Joi = require('joi');

const validateName = Joi.object().keys({
    name: Joi.string().pattern(/^[a-zA-Z]+$/).required().messages({
        'string.base': 'Name must be a string',
        'string.pattern.base': 'Name must be a string',
        'string.empty': 'Name query parameter is required',
        'any.required': 'Name query parameter is required'
    })
});

module.exports = {
    validateName
}