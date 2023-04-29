import joi from 'joi';
import { NewCertificate } from '../model/certificate';
import Joi from 'joi';
import { capitalizeFirstLetter, objectId } from './custom';

// new certificate validator
const createCertBody: Record<keyof NewCertificate, any> = {
    name: joi.string().required().custom(capitalizeFirstLetter).trim(),
    certNumber: joi.string().required().trim(),
    photo: joi.string().required(),
}

export const createCert = {
    body: joi.object().keys(createCertBody),
}

export const deleteCert = {
    params: Joi.object().keys({
        orgId: Joi.string().custom(objectId),
        certId: Joi.string().custom(objectId)
    }),
};

