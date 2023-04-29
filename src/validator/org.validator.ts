import joi from 'joi';
import { NewOrg, ORG_SECTOR_TYPE, ORG_STATUS, ORG_TYPE } from '../model/organization';
import Joi from 'joi';
import { capitalizeFirstLetter, objectId } from './custom';
import { NewLicense } from '../model/license';
import { NewAddress } from '../model/address';
import { NewCertificate } from '../model/certificate';

// new license validator
const createLicenseBody: Record<keyof NewLicense, any> = {
    name: joi.string().lowercase().trim(),
    licenseNumber: joi.string().trim(),
    expDate: joi.date(),
    photo: joi.string(),
}
// new Address validator
const createAddressBody: Record<keyof NewAddress, any> = {
    city: joi.string().trim().custom(capitalizeFirstLetter),
    subcity: joi.string().trim().custom(capitalizeFirstLetter),
    woreda: joi.string().trim().custom(capitalizeFirstLetter),
    telephoneNum: joi.string().trim(),
}
// new certificate validator
const createCertBody: Record<keyof NewCertificate, any> = {
    name: joi.string().trim().custom(capitalizeFirstLetter),
    certNumber: joi.string().trim(),
    photo: joi.string(),
}




// new org validator
export const createOrgBody: Record<keyof NewOrg, any> = {
    name: joi.string().lowercase().custom(capitalizeFirstLetter).trim(),
    address: joi.object().keys(createAddressBody),
    type: joi.string().valid(...Object.values(ORG_TYPE)).insensitive().trim(),
    tinNo: joi.string().trim(),
    capital: joi.number().integer(),
    sector: joi.string().valid(...Object.values(ORG_SECTOR_TYPE)).insensitive().trim(),
    status: joi.string().valid(...Object.values(ORG_STATUS)).insensitive().trim(),
    license: joi.object().keys(createLicenseBody),
    certificates: joi.array().items(joi.object().keys(createCertBody)),
}

export const createOrg = {
    body: joi.object().keys(createOrgBody).options({ presence: "required" }),
}

export const getOrgs = {
    query: Joi.object().keys({
        name: createOrgBody.name,
        type: createOrgBody.type,
        sector: createOrgBody.sector,
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

