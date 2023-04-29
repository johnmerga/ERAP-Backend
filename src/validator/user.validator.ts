import joi from 'joi';
import { NewUser, Role } from '../model/user';
import Joi from 'joi';
import { capitalizeFirstLetter, objectId, password } from './custom';

// new user validator

const createUserBody: Record<keyof NewUser, any> = {
    name: joi.string().custom(capitalizeFirstLetter).trim(),
    email: joi.string().email().lowercase().trim(),
    password: joi.string().custom(password).trim(),
    address: joi.string().custom(capitalizeFirstLetter).trim(),
    phone: joi.string().trim(),
}

export const createUser = {
    body: joi.object().keys(createUserBody).options({ presence: "required" }),
}

export const getUsers = {
    query: Joi.object().keys({
        name: createUserBody.name,
        roles: Joi.string().valid(...Object.values(Role)).insensitive().trim(),
        orgId: Joi.string().custom(objectId),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        populate: Joi.string(),
    })
}

export const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

export const updateUser = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            ...createUserBody,
            roles: joi.array().items(joi.string().valid(...Object.values(Role)).insensitive().trim()),
        })
        .min(1),
};

export const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};
