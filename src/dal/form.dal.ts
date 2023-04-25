import { Form, NewForm, UpdateFormBody, IFormDoc } from "../model/form";
import { ApiError } from "../errors";
import httpStatus from "http-status";

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
    async updateForm(id: string, update: UpdateFormBody): Promise<IFormDoc> {
        try {
            const form = await Form.findById(id)
            if (!form) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Form not found')
            }
            form.set(update)
            return form.save()
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while updating form')

        }
    }
    async deleteForm(id:string): Promise<IFormDoc> {
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