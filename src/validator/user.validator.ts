import joi from 'joi';

// new user validator

export const newUserValidator = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    // createdAt: joi.date().default(Date.now()),
    // updatedAt: joi.date().default(Date.now()),
});

