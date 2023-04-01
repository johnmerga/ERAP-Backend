import joi from 'joi';

// new user validator

export const newUserValidator = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    address: joi.string().required(),
    phone: joi.string().required(),
    role: joi.array().items(joi.string()).required(),
    permissions: joi.array().items(joi.string()).required()
});

