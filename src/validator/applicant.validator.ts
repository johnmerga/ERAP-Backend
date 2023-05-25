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

export const getApplicants = {
    params: joi.object().keys({
        tenderId: joi.string().custom(objectId).trim().required(),
    }),
    query: joi.object().keys({
        orgId: joi.string().custom(objectId).trim(),
        isApplicationSubmitted: joi.boolean(),
        sortBy: joi.string(),
        limit: joi.number().integer(),
        page: joi.number().integer(),
        populate: joi.string().valid('orgId.name', 'tenderId.title', 'orgId.name,tenderId.title', 'tenderId.title,orgId.name'),
    }),
}

export const deleteApplicant = {
    params: joi.object().keys({
        applicantId: joi.string().custom(objectId).trim(),
    }),
}