import Joi from "joi";
import { NewPaymentInputType, PaymentStatus, PaymentType } from "../model/payment";
import { objectId } from "./custom";

const mongoId = Joi.string().custom(objectId);

const createPaymentBody: Record<keyof NewPaymentInputType, any> = {
    formId: Joi.custom(objectId),
    paymentType: Joi.string().valid(...Object.values(PaymentType)).insensitive().trim(),
    payerInfo: Joi.object().keys({
        first_name: Joi.string().trim(),
        last_name: Joi.string().trim(),
        email: Joi.string().email().trim(),
        phone: Joi.string().trim(),
    }).options({ presence: 'required' }),
    // amount: Joi.number().required().min(1),
    // check if its a url
    return_url: Joi.string().uri().trim(),

};

export const createPayment = {
    body: Joi.object().keys(createPaymentBody).options({ presence: 'required', abortEarly: false }),
}

export const verifyPayment = {
    params: Joi.object().keys({
        // regex example ERAP-264a9851-83 the length and the format should follow this pattern `ERAP-264a9851-83`
        tx_ref: Joi.string().required().trim().regex(/^ERAP-[a-zA-Z0-9]{8}-[a-zA-Z0-9]{2}$/),
    }).required(),
}

export const getPaymentByOrgId = {
    query: Joi.object().keys({
        paymentType: Joi.string().valid(...Object.values(PaymentType)).insensitive().trim(),
        paymentStatus: Joi.string().valid(...Object.values(PaymentStatus)).insensitive().trim(),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }).required(),
}
export const getPaymentByTenderId = {
    params: Joi.object().keys({
        tenderId: mongoId.required().trim(),
    }).required(),
}