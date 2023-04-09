import joi from 'joi';
import { NewUser } from '../model/user';
import Joi from 'joi';
import { objectId, password } from './custom';

// new user validator

const createUserBody: Record<keyof NewUser, any> = {
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().custom(password),
    address: joi.string().required(),
    phone: joi.string().required(),

}

export const createUser = {
    body: joi.object().keys(createUserBody),
}

export const getUsers = {
    query: Joi.object().keys({
        name: Joi.string(),
        roles: Joi.string(),
        orgId: Joi.string().custom(objectId),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),


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
            email: Joi.string().email(),
            password: Joi.string().custom(password),
            name: Joi.string(),
            address: joi.string(),
            phone: joi.string(),
            roles: joi.array().items(joi.string()),
        })
        .min(1),
};

export const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

