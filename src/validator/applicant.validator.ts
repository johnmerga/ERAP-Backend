import { NewApplicant } from "../model/applicants";
import joi from "joi";
import { objectId } from "./custom";

const applicantBody: Record<keyof NewApplicant, any> = {
    orgId: joi.string().custom(objectId).trim(),
    tenderId: joi.string().custom(objectId).trim(),
    paymentId: joi.string().custom(objectId).trim(),
    isApplicationSubmitted: joi.boolean(),
}

export const createApplicant = {
    body: joi.object().keys(applicantBody).options({ presence: 'required' })
}

export const getApplicant = {
    params: joi.object().keys({
        applicantId: joi.string().custom(objectId).trim(),
    }),
}

export const deleteApplicant = {
    params: joi.object().keys({
        applicantId: joi.string().custom(objectId).trim(),
    }),
}