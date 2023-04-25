import { NewTender, TenderStatus, TenderType, } from "../model/tender";
import joi from "joi";
import { objectId } from "./custom";
import { ORG_SECTOR_TYPE } from "../model/organization";

const tenderBody: Record<keyof NewTender, any> = {
    orgId: joi.string().custom(objectId),
    title: joi.string(),
    description: joi.string(),
    type: joi.string().valid(...Object.values(TenderType)),
    sector: joi.string().valid(...Object.values(ORG_SECTOR_TYPE)),
    status: joi.string().valid(...Object.values(TenderStatus)),
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
        status: joi.string().valid(...Object.values(TenderStatus)),
        type: joi.string().valid(...Object.values(TenderType)),
        sector: joi.string().valid(...Object.values(ORG_SECTOR_TYPE)),
        page: joi.number().min(1),
        limit: joi.number().min(1),
        sortBy: joi.string(),
        projectBy: joi.string(),
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
    // export const getTenderApplicants = {
    //     params: joi.object().keys({
    //         tenderId: joi.string().custom(objectId),
    //     }),
    // }
}