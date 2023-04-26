import joi from "joi";
import { objectId } from "./custom";
import { NewForm, FormQuestionType, FormType, IFormFields } from "../model/form"

// a single question validation
const formQuestionBody: Record<keyof IFormFields, any> = {
    question: joi.string(),
    type: joi.string().valid(...Object.values(FormQuestionType)),
    options: joi.array().items(joi.string()).when('type', {
        is: [FormQuestionType.CHECKBOX, FormQuestionType.RADIO, FormQuestionType.DROPDOWN],
        then: joi.array().items(joi.string().required()).required(),
        otherwise: joi.array().items(joi.string()).optional(),
    }),
    required: joi.boolean(),
}
// form validation
const formBody: Record<keyof NewForm, any> = {
    tenderId: joi.string().custom(objectId),
    description: joi.string(),
    title: joi.string(),
    type: joi.string().valid(...Object.values(FormType)),
    fields: joi.array().items(formQuestionBody),
}

export const createForm = {
    body: joi.object().keys(formBody).options({ presence: 'required' })
}

export const getForm = {
    params: joi.object().keys({
        formId: joi.string().custom(objectId),
    }),
}

export const updateForm = {
    params: joi.object().keys({
        formId: joi.string().custom(objectId),
    }),
    body: joi.object().keys(formBody).min(1),
}

export const deleteForm = {
    params: joi.object().keys({
        formId: joi.string().custom(objectId),
    }),
}
