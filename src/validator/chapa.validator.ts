import Joi from "joi";
import { NewChapaPayment } from "../model/payment";

const createChapaPaymentBody: Record<keyof NewChapaPayment, any> = {
    first_name: Joi.string().required().trim(),
    last_name: Joi.string().required().trim(),
    email: Joi.string().email().trim(),
    amount: Joi.number().required().min(1),

};

export const createChapaPayment = {
    body: Joi.object().keys(createChapaPaymentBody).options({ presence: 'required', abortEarly: false }),
}

export const verifyChapaPayment = {
    params: Joi.object().keys({
        // regex example ERAP-264a9851-83 the length and the format should follow this pattern `ERAP-264a9851-83`
        tx_ref: Joi.string().required().trim().regex(/^ERAP-[a-zA-Z0-9]{8}-[a-zA-Z0-9]{2}$/),
    }).required(),
}