import { NewTenderInputValidator, TenderStatus, TenderType, } from "../model/tender";
import joi from "joi";
import { objectId } from "./custom";
import { ORG_SECTOR_TYPE } from "../model/organization";

const tenderBody: Record<keyof NewTenderInputValidator, any> = {
    title: joi.string().trim(),
    description: joi.string().trim(),
    price: joi.number().min(1),
    type: joi.string().valid(...Object.values(TenderType)).insensitive().trim(),
    sector: joi.string().valid(...Object.values(ORG_SECTOR_TYPE)).insensitive().trim(),
    qualifications: joi.array().items(joi.string().trim()).optional(),
    status: joi.string().valid(...Object.values(TenderStatus)).insensitive().trim(),
    openDate: joi.date(),
    closeDate: joi.date(),
    bidDeadline: joi.date(),
};

export const createTender = {
    body: joi.object().keys(tenderBody).options({ presence: 'required' })
}

export const getTender = {
    params: joi.object().keys({
        tenderId: joi.string().custom(objectId),
    }),
}

export const getTenders = {
    query: joi.object().keys({
        orgId: joi.string().custom(objectId),
        status: tenderBody.status,
        type: tenderBody.type,
        sector: tenderBody.sector,
        page: joi.number().min(1),
        limit: joi.number().min(1),
        sortBy: joi.string(),
        projectBy: joi.string(),
    })
}
export const getTenderApplicants = {
    params: joi.object().keys({
        tenderId: joi.string().custom(objectId),
    }),
    query: joi.object().keys({
        page: joi.number().min(1),
        limit: joi.number().min(1),
        sortBy: joi.string(),
        projectBy: joi.string(),
        populate: joi.string().valid('orgId.name', 'tenderId.title', 'orgId.name,tenderId.title', 'tenderId.title,orgId.name'),

    })
}

export const updateTender = {
    params: joi.object().keys({
        tenderId: joi.string().custom(objectId),
    }),
    body: joi.object().keys(tenderBody).min(1),
}

export const deleteTender = {
    params: joi.object().keys({
        tenderId: joi.string().custom(objectId),
    }),
}