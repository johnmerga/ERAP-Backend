import joi from 'joi';
import { NewOrg } from '../model/organization';
import Joi from 'joi';
import { objectId } from './custom';
import { NewLicense } from '../model/license';
import { NewAddress } from '../model/address';
import { NewCertificate } from '../model/certificate';

// new license validator
const createLicenseBody: Record<keyof NewLicense, any> = {
    name: joi.string(),
    licenseNumber: joi.string(),
    expDate: joi.date(),
    photo: joi.string(),
}
// new Address validator
const createAddressBody: Record<keyof NewAddress, any> = {
    city: joi.string(),
    subcity: joi.string(),
    woreda: joi.string(),
    telephoneNum: joi.string(),
}
// new certificate validator
const createCertBody: Record<keyof NewCertificate, any> = {
    name: joi.string(),
    photo: joi.string(),
    certNumber: joi.string()
}




// new org validator
export const createOrgBody: Record<keyof NewOrg, any> = {
    name: joi.string(),
    address: joi.object().keys(createAddressBody),
    type: joi.string(),
    tinNo: joi.string(),
    capital: joi.number().integer(),
    sector: joi.string(),
    status: joi.string(),
    license: joi.object().keys(createLicenseBody),
    certificates: joi.array().items(joi.object().keys(createCertBody)),
}

export const createOrg = {
    body: joi.object().keys(createOrgBody).options({ presence: "required" }),
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
        .keys(createOrgBody)
        .min(1),
};

export const deleteOrg = {
    params: Joi.object().keys({
        orgId: Joi.string().custom(objectId),
    }),
}

