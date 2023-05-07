import Joi from "joi";
import { objectId } from "./custom";
import { NewSubmission, NewAnswer } from "../model/submission";

const answerBody: Record<keyof NewAnswer, any> = {
    questionId: Joi.string().custom(objectId).trim(),
    answer: Joi.string().trim(),
}

const submissionBody: Record<keyof NewSubmission, any> = {
    tenderId: Joi.string().custom(objectId).trim(),
    orgId: Joi.string().custom(objectId).trim(),
    formId: Joi.string().custom(objectId).trim(),
    answers: Joi.array().items(Joi.object().keys(answerBody)).min(1),
}

export const createSubmission = {
    body: Joi.object().keys(submissionBody).options({ presence: 'required' })
}

export const getSubmission = {
    params: Joi.object().keys({
        submissionId: Joi.string().custom(objectId),
    }),
}

export const getSubmissions = {
    query: Joi.object().keys({
        tenderId: submissionBody.tenderId,
        orgId: submissionBody.orgId,
        formId: submissionBody.formId,
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
        sortBy: Joi.string(),
        projectBy: Joi.string(),
    })
}

export const updateSubmission = {
    params: Joi.object().keys({
        submissionId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        ...submissionBody,
        answers: Joi.array().items(Joi.object().keys({
            ...answerBody,
            id: Joi.string().custom(objectId).trim(),
        })).min(1),
    }).min(1)
}

// delete answers
export const deleteAnswers = {
    params: Joi.object().keys({
        submissionId: Joi.string().custom(objectId)
    }),
    body: Joi.object().keys({
        answerIds: Joi.array().items(Joi.string().custom(objectId)).min(1)
    }).options({ presence: 'required' })
}

export const deleteSubmission = {
    params: Joi.object().keys({
        submissionId: Joi.string().custom(objectId),
    }),
}

export const evaluateSubmission = {
    params: Joi.object().keys({
        submissionId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        marks: Joi.array().items(
            Joi.object({
                id: Joi.custom(objectId).required(),
                mark: Joi.number().min(0).max(10).required()
            }))
    })
}
