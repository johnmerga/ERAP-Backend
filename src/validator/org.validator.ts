import joi from 'joi';
import { NewOrgValidator, ORG_SECTOR_TYPE, ORG_STATUS, ORG_TYPE } from '../model/organization';
import Joi from 'joi';
import { capitalizeFirstLetter, objectId } from './custom';
import { UpdateLicenseBody } from '../model/license';
import { UpdateAddressBody } from '../model/address';
import { UpdateCertificateBody } from '../model/certificate';

// new license validator
const createLicenseBody: Record<keyof UpdateLicenseBody, any> = {
    id: joi.custom(objectId).optional(),
    name: joi.string().lowercase().trim(),
    licenseNumber: joi.string().trim(),
    expDate: joi.date(),
    photo: joi.string(),
}
// new Address validator
const createAddressBody: Record<keyof UpdateAddressBody, any> = {
    id: joi.custom(objectId).optional(),
    city: joi.string().trim().custom(capitalizeFirstLetter),
    subcity: joi.string().trim().custom(capitalizeFirstLetter),
    woreda: joi.string().trim().custom(capitalizeFirstLetter),
    telephoneNum: joi.string().trim(),
}
// new certificate validator
const createCertBody: Record<keyof UpdateCertificateBody, any> = {
    id: joi.custom(objectId),
    name: joi.string().trim().custom(capitalizeFirstLetter),
    certNumber: joi.string().trim(),
    photo: joi.string(),
}




// new org validator
export const createOrgBody: Record<keyof NewOrgValidator, any> = {
    name: joi.string().lowercase().custom(capitalizeFirstLetter).trim(),
    address: joi.object().keys(createAddressBody),
    type: joi.string().valid(...Object.values(ORG_TYPE)).insensitive().trim(),
    tinNo: joi.string().trim(),
    capital: joi.number().integer(),
    sector: joi.string().valid(...Object.values(ORG_SECTOR_TYPE)).insensitive().trim(),
    license: joi.object().keys(createLicenseBody),
    profilePhoto: joi.string(),
    certificates: joi.array().items(joi.object().keys(createCertBody)),
}


//
const { certificates, license, address, ...otherOrgBody } = createOrgBody
const { id: certId, ...otherCertBody } = createCertBody
const { id: licenseId, ...otherLicenseBody } = createLicenseBody
const { id: addressId, ...otherAddressBody } = createAddressBody

export const createOrg = {
    body: joi.object().keys({
        ...otherOrgBody,
        certificates: joi.array().items(
            joi.object().keys(otherCertBody).options({ presence: 'required' })
        ),
        license: joi.object().keys(otherLicenseBody),
        address: joi.object().keys(otherAddressBody),
    }).options({ presence: "required", abortEarly: false }),
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
        .keys({
            ...otherOrgBody,
            address
        })
        .min(1),
};

// update organization status
export const updateOrgStatus = {
    params: Joi.object().keys({
        orgId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        status: Joi.string().valid(...Object.values(ORG_STATUS)).insensitive().trim(),
    }).required()
}

export const updateOrgRating = {
    params: Joi.object().keys({
        orgId: Joi.required().custom(objectId),
    }),
    body: Joi.object().keys({
        rating: Joi.number().required().min(1).max(5),
    }).required()
}

// add organization certificates
export const addCertificates = {
    params: Joi.object().keys({
        orgId: Joi.string().custom(objectId),
    }),
    body: {
        certificates: Joi.array().items(joi.object().required().keys({
            name: createCertBody.name,
            certNumber: createCertBody.certNumber,
            photo: createCertBody.photo,
        })).options({
            presence: "required"
        }).required(),
    }
}
// update organization certificates
export const updateCertificates = {
    params: Joi.object().keys({
        orgId: Joi.string().custom(objectId),
    }),
    body: {
        certificates: Joi.array().items(joi.object().required().keys(createCertBody)).options({
            presence: "required"
        }).required(),

    }
}
// delete organization certificates
export const deleteCert = {
    params: Joi.object().keys({
        orgId: Joi.string().custom(objectId),
    }),
    body: {
        certificates: Joi.array().items(joi.object().required().keys({
            id: createCertBody.id,
        })).options({
            presence: "required"
        }).required(),
    },
}

export const deleteOrg = {
    params: Joi.object().keys({
        orgId: Joi.string().custom(objectId),
    }),
}

