import joi from "joi";
import { objectId } from "./custom";
import { NewForm, FormQuestionType, FormType, IFormFields, ITable } from "../model/form"

/**
 * ------------------------------------------table validation------------------------------------------
 */

const tableBody: Record<keyof ITable, any> = {
    columns: joi
        .array()
        .items(
            joi.object().keys({
                name: joi.string().trim().required(),
                type: joi.string().valid('string', 'number', 'boolean').insensitive().required(),
            })
        )
        .options({ presence: 'required' })
        .required(),
    rows: joi
        .object()
        .pattern(
            joi.string().required().trim(),
            joi
                .object()
                .pattern(
                    joi.string().required().trim(),
                    joi.any().required()
                )
                .custom((value, helpers) => {
                    const columns = helpers.state.ancestors[1]['columns'] as any[]
                    const columnLength = columns.length;

                    const valueKeys = Object.keys(value);
                    const valueKeysLength = valueKeys.length;

                    if (valueKeysLength !== columnLength) {
                        return helpers.error('object.length', { columnLength });
                    }

                    return value;
                })
                .required()
        ).options({ presence: 'required' })
        .custom((value, helpers) => {
            // console.log(`"""""""""""""""""""""""""""""""""""""`)
            const columns = helpers.state.ancestors[0]['columns']
            const rows = helpers.state.ancestors[0]['rows']
            const columnNames = columns.map((column: any) => column.name)
            // const rowNames = Object.keys(rows)
            const rowValues = Object.values(rows) as Record<string, any>[]
            // checking if the for each row the column names are the same as the column names in the table
            for (const row of rowValues) {
                const rowKeys = Object.keys(row)
                if (rowKeys.length !== columnNames.length) {
                    return helpers.error('object.length', { columnLength: columnNames.length });
                }
                for (const key of rowKeys) {
                    if (!columnNames.includes(key)) {
                        return helpers.error('object.length', { columnLength: columnNames.length });
                    }
                }
            }
            // console.log(columnNames);
            // console.log(rowValues);
            // console.log(`"""""""""""""""""""""""""""""""""""""`)

            return value
        }).options({ presence: 'required' })
        .required(),
};



/**
 * ----------------------------------------------------------------------------------------------------
 */

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
    value: joi.number().integer().default(10),
    required: joi.boolean(),
}
// form validation
const formBody: Record<keyof NewForm, any> = {
    tenderId: joi.string().custom(objectId).trim(),
    description: joi.string().trim(),
    title: joi.string().trim(),
    type: joi.string().valid(...Object.values(FormType)).insensitive(),
    fields: joi.array().items(formQuestionBody),
    table: joi.object().keys(tableBody),
}

const { fields, ...otherFormBody } = formBody
const { id, ...otherFormQuestionBody } = formQuestionBody


export const createForm = {
    body: joi.object().keys({
        ...otherFormBody,
        table: joi.when('type', {
            is: FormType.FINANCIAL,
            then: joi.object().keys(tableBody).required(),
            otherwise: joi.object().keys(tableBody).forbidden(),
        }),
        fields: joi.when('type', {
            is: FormType.TECHNICAL,
            then: joi.array().items(joi.object().keys(otherFormQuestionBody).options({ presence: 'required' })).required(),
            otherwise: joi.forbidden(),
        }),
    }).options({
        presence: 'required',
    })
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

