import { Form, NewForm, UpdateFormBody, IFormDoc } from "../model/form";
import { ApiError } from "../errors";
import httpStatus from "http-status";
import { Operation, updateSubDocuments } from "../utils";

export class FormDal {

    async create(form: NewForm): Promise<IFormDoc> {
        try {
            const newForm = await new Form(form).save()
            return newForm
        } catch (error) {
            throw new Error('error occurred while creating form ')
        }

    }

    async getForm(id: string): Promise<IFormDoc> {
        try {
            const form = await Form.findById(id);
            if (!form) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Form not found')
            }
            return form;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while fetching form')

        }
    }

    async getForms(): Promise<IFormDoc[]> {
        try {
            const forms = await Form.find()
            return forms
        } catch (error) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while fetching forms')
        }
    }
    async updateForm(formId: string, update: UpdateFormBody, fieldsOperation?: Operation): Promise<IFormDoc> {
        try {

            const { fields, ...otherFields } = update
            if (otherFields && (!fields || !fields[0])) {
                const form = await this.getForm(formId)
                await form.set(otherFields).save()
                return form
            }

            if (fields && fields.length > 0) {
                const subDocUpdates = fields.map(({ id, ...otherQuestionFields }) => ({
                    id,
                    update: {
                        _id: id,
                        ...otherQuestionFields
                    }
                }))
                const isSubDocSaved = await updateSubDocuments(Form, formId, 'fields', subDocUpdates, fieldsOperation ?? Operation.UPDATE)
                if (isSubDocSaved instanceof Error) {
                    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, isSubDocSaved.message)
                }
                return isSubDocSaved
            }
            throw new ApiError(httpStatus.BAD_REQUEST, 'form not updated: unhanded error')

        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'system error: something went wrong while updating form')

        }
    }
    async deleteForm(id: string): Promise<IFormDoc> {
        try {

            const form = await Form.findByIdAndDelete(id)
            if (!form) {
                throw new ApiError(httpStatus.NOT_FOUND, 'the form you are trying to delete does not exist or may have already')
            }
            return form
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while deleting form')
        }
    }
}