import joi from "joi";
import { objectId } from "./custom";
import { NewForm, FormQuestionType, FormType, IFormFields } from "../model/form"

// a single question validation
const formQuestionBody: Record<keyof IFormFields, any> = {
    id: joi.string().custom(objectId).trim(),
    question: joi.string().trim(),
    description: joi.string().trim().optional(),
    type: joi.string().valid(...Object.values(FormQuestionType)).insensitive(),
    options: joi.array().items(joi.string()).when('type', {
        is: [FormQuestionType.CHECKBOX, FormQuestionType.RADIO, FormQuestionType.DROPDOWN],
        then: joi.array().items(joi.string().required().trim()).required(),
        otherwise: joi.array().items(joi.string()).optional(),
    }),
    required: joi.boolean(),
}
// form validation
const formBody: Record<keyof NewForm, any> = {
    tenderId: joi.string().custom(objectId).trim(),
    description: joi.string().trim(),
    title: joi.string().trim(),
    type: joi.string().valid(...Object.values(FormType)).insensitive(),
    fields: joi.array().items(formQuestionBody),
    table: joi.array().items(joi.object().keys({
        row: joi.array().items(joi.string().trim()).required(),
        column: joi.array().items(joi.string().trim()).required(),
    })).optional(),
}

const { fields, ...otherFormBody } = formBody
const { id, ...otherFormQuestionBody } = formQuestionBody


export const createForm = {
    body: joi.object().keys({
        ...otherFormBody,
        fields: joi.array().items(
            joi.object().keys(otherFormQuestionBody).options({ presence: 'required' })
        ).required(),

    }).options({ presence: 'required' })
}

export const getForm = {
    params: joi.object().keys({
        formId: joi.string().custom(objectId),
    }),
}

export const getForms = {
    query: joi.object().keys({
        tenderId: joi.string().custom(objectId).trim(),
        type: joi.string().valid(...Object.values(FormType)).insensitive(),
        page: joi.number().min(1),
        limit: joi.number().min(1),
        sortBy: joi.string(),
        projectBy: joi.string(),
        populate: joi.string(),
    })
}
export const updateForm = {
    params: joi.object().keys({
        formId: joi.string().custom(objectId),
    }),
    body: joi.object().keys(otherFormBody).min(1),
}

export const deleteForm = {
    params: joi.object().keys({
        formId: joi.string().custom(objectId),
    }),
}

/**
 * ----------------------------------------------------------------------------------------------------
 * only form fields validation
 *  ----------------------------------------------------------------------------------------------------
 */
export const addFormFields = {
    params: joi.object().keys({
        formId: joi.string().custom(objectId),
    }),
    body: joi.object().keys({
        fields: joi.array().items(
            joi.object().keys(otherFormQuestionBody).options({ presence: 'required' })
        ).required(),
    })
}

export const updateFormFields = {
    params: joi.object().keys({
        formId: joi.string().custom(objectId),
    }),
    body: joi.object().keys({
        fields: joi.array().items(
            joi.object().keys(formQuestionBody).options({ presence: 'required' })
        ).required(),
    })
}

export const deleteFormFields = {
    params: joi.object().keys({
        formId: joi.string().custom(objectId),
    }),
    body: joi.object().keys({
        fields: joi.array().items(
            joi.object().keys({
                id: joi.string().custom(objectId).trim().required(),
            }).options({ presence: 'required' })
        ).required(),
    })
}

