import { ITenderQuery, NewTenderInputValidator, TenderStatus, TenderType, } from "../model/tender";
import joi from "joi";
import { capitalizeFirstLetter, customArrayValidator, objectId } from "./custom";
import { ORG_SECTOR_TYPE } from "../model/organization";

const tenderBody: Record<keyof NewTenderInputValidator, any> = {
    title: joi.string().trim().custom(capitalizeFirstLetter),
    description: joi.string().trim(),
    price: joi.number().min(1),
    type: joi.string().valid(...Object.values(TenderType)).insensitive().trim(),
    sector: joi.string().valid(...Object.values(ORG_SECTOR_TYPE)).insensitive().trim(),
    qualifications: joi.array().items(joi.string().trim()).optional(),
    status: joi.string().valid(...Object.values(TenderStatus)).insensitive().trim(),
    // check if the date is not before today
    openDate: joi.date().label('Date format: YYYY-MM-DD').min('now'),
    closeDate: joi.date().label('Date format: YYYY-MM-DD').min('now'),
    bidDeadline: joi.date().min('now').label('Date format: YYYY-MM-DD'),
};
// get tender by comparing 
const createTenderCompareBody: Record<keyof ITenderQuery, any> = {
    // the date format is YYYY-MM-DD and convert it to date object using moment
    openDate: joi.array().items(
        joi.alternatives().try(
            joi.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
            joi.string().valid('').label(`"if you don't want to pass only the first arguments(parameter) use and empty string like this-> ""`)
        ).default("").optional(),
        joi.alternatives().try(
            joi.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/)),
        joi.string().valid('').label(`"if you don't want to pass only the first arguments(parameter) use and empty string like this-> ""`)
            .default("").optional())
        .optional().min(1).label(`example of date format: ['2021-01-01', '2021-01-01']`),
    closeDate: joi.array().items(
        joi.alternatives().try(
            joi.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
            joi.string().valid('').label(`"if you don't want to pass only the first arguments(parameter) use and empty string like this-> ""`)
        ).default("").optional(),
        joi.alternatives().try(
            joi.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/)),
        joi.string().valid('').label(`"if you don't want to pass only the first arguments(parameter) use and empty string like this-> ""`)
            .default("").optional()
    ).
        optional().min(1).label(`example of date format: ['2021-01-01', '2021-01-01']`),
    bidDeadline: joi.array().items(
        joi.alternatives().try(
            joi.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
            joi.string().valid('').label(`"if you don't want to pass only the first arguments(parameter) use and empty string like this-> ""`)
        ).default("").optional(),
        joi.alternatives().try(
            joi.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
            joi.string().valid('').label(`"if you don't want to pass only the first arguments(parameter) use and empty string like this-> ""`)
        ).default("").optional()
    )
        .optional().min(1).label(`example of date format: ['2021-01-01', '2021-01-01']`),
    price: joi.array().items(
        joi.alternatives()
            .try(
                joi.number().min(0),
                joi.string().valid('').label(`"if you don't want to pass only the first arguments(parameter) use and empty string like this-> ""`)
            ).optional().default(""),
        joi.alternatives()
            .try(
                joi.number().min(0),
                joi.string().valid('').label(`"if you don't want to pass only the first arguments(parameter) use and empty string like this-> ""`)
            ).optional().default("")
    ).optional().min(1).label(`example of price format: [0, 1000]`),
}

const reusableTenderComparableBody: Record<keyof ITenderQuery, any> = {
    price: joi.custom(customArrayValidator).custom((value, helpers) => {
        const arraySchema = createTenderCompareBody.price
        const { error } = arraySchema.validate(value)
        if (error) {
            return helpers.error(error.message)
        }
        return value
    }),
    // date validation
    openDate: joi.custom(customArrayValidator).custom((value, helpers) => {
        const arraySchema = createTenderCompareBody.openDate
        const { error } = arraySchema.validate(value)
        if (error) {
            return helpers.error(error.message)
        }
        // validate if it's a date
        return value
    }),
    // date validation
    closeDate: joi.custom(customArrayValidator).custom((value, helpers) => {
        const arraySchema = createTenderCompareBody.closeDate
        const { error } = arraySchema.validate(value)
        if (error) {
            return helpers.error(error.message)
        }
        return value
    }),
    // date validation
    bidDeadline: joi.custom(customArrayValidator).custom((value, helpers) => {
        const arraySchema = createTenderCompareBody.bidDeadline
        const { error } = arraySchema.validate(value)
        if (error) {
            return helpers.error(error.message)
        }
        return value
    }),
}


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
        search: joi.string().trim(),
        orgId: joi.string().custom(objectId),
        status: tenderBody.status,
        type: tenderBody.type,
        sector: tenderBody.sector,
        price: reusableTenderComparableBody.price,
        openDate: reusableTenderComparableBody.openDate,
        closeDate: reusableTenderComparableBody.closeDate,
        bidDeadline: reusableTenderComparableBody.bidDeadline,
        page: joi.number().min(1),
        limit: joi.number().min(1),
        sortBy: joi.string(),
        projectBy: joi.string(),
    }),
    // body: joi.object().keys(createTenderCompareBody).options({ abortEarly: false }),
}
export const getTenderInvitations = {
    // query: joi.object().keys({
    //     search: joi.string().trim(),
    //     orgId: joi.string().custom(objectId),
    //     status: tenderBody.status,
    //     type: tenderBody.type,
    //     sector: tenderBody.sector,
    //     price: reusableTenderComparableBody.price,
    //     openDate: reusableTenderComparableBody.openDate,
    //     closeDate: reusableTenderComparableBody.closeDate,
    //     bidDeadline: reusableTenderComparableBody.bidDeadline,
    //     page: joi.number().min(1),
    //     limit: joi.number().min(1),
    //     sortBy: joi.string(),
    //     projectBy: joi.string(),
    // }),
    // body: joi.object().keys(createTenderCompareBody).options({ abortEarly: false }),
}
export const getMyTenders = {
    query: joi.object().keys({
        search: joi.string().trim(),
        type: tenderBody.type,
        sector: tenderBody.sector,
        price: reusableTenderComparableBody.price,
        openDate: reusableTenderComparableBody.openDate,
        closeDate: reusableTenderComparableBody.closeDate,
        bidDeadline: reusableTenderComparableBody.bidDeadline,
        page: joi.number().min(1),
        limit: joi.number().min(1),
        sortBy: joi.string(),
        projectBy: joi.string(),
    }),
    // body: joi.object().keys(createTenderCompareBody).options({ abortEarly: false }),
}
export const getPublishedTenders = {
    query: joi.object().keys({
        search: joi.string().trim(),
        // orgId: joi.string().custom(objectId),
        // status: tenderBody.status,
        // type: tenderBody.type,
        sector: tenderBody.sector,
        openDate: reusableTenderComparableBody.openDate,
        closeDate: reusableTenderComparableBody.closeDate,
        bidDeadline: reusableTenderComparableBody.bidDeadline,
        price: reusableTenderComparableBody.price,
        page: joi.number().min(1),
        limit: joi.number().min(1),
        sortBy: joi.string(),
        projectBy: joi.string(),
    }),
    // body: joi.object().keys(createTenderCompareBody).options({ abortEarly: false }),
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

export const inviteTender = {
    params: joi.object().keys({
        tenderId: joi.string().custom(objectId),
    }),
    body: joi.object().keys({
        orgIds: joi.array().items(joi.string().custom(objectId)).min(1).required(),
    })
}