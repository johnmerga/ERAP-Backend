import joi from 'joi';
import { NewOrg } from '../model/organization';
import Joi from 'joi';
import { objectId } from './custom';

// new org validator

const createOrgBody: Record<keyof NewOrg, any> = {
    name: joi.string().required(),
    address: joi.string().required(),
    type: joi.string().required(),
    tinNo: joi.string().required(),
    capital: joi.string().required(),
    sector: joi.string().required(),
    status: joi.string().required(),
    license: joi.string().required(),
    certificate: joi.string(),
}

export const createOrg = {
    body: joi.object().keys(createOrgBody),
}   

export const getOrgs = {
    query: Joi.object().keys({
        name: Joi.string(),
        type: Joi.string(),
        sector: Joi.string(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        capital: Joi.number().integer(),
        rating: Joi.number().integer(),

    })
}

export const getOrg = {
    params: Joi.object().keys({
        orgId: Joi.string().custom(objectId),
    }),
};

export const updateOrg = {
    params: Joi.object().keys({
        orgId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            name: joi.string(),
            address: joi.string(),
            type: joi.string(),
            tinNo: joi.string(),
            capital: joi.string(),
            sector: joi.string(),
            status: joi.string(),
            license: joi.string(),
            certificate: joi.string(),
            rating: joi.number().integer(),
        })
        .min(1),
};