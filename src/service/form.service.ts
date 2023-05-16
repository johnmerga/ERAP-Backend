import httpStatus from "http-status";
import { FormDal } from "../dal/form.dal";
import { ApiError } from "../errors";
import { Form, IFormDoc, IFormFields, NewForm, NewFormFields, UpdateFormBody } from "../model/form";
import { IOptions, Operation, QueryResult, checkIdsInSubDocs, } from "../utils";
import { TenderService } from "../service/";
export class FormService {
    private formDal: FormDal
    private tenderService: TenderService
    constructor() {
        this.formDal = new FormDal()
        this.tenderService = new TenderService()
    }
    async createForm(form: NewForm): Promise<IFormDoc> {
        await this.tenderService.getTenderById((form.tenderId).toString())
        return await this.formDal.create(form)
    }
    async getForm(id: string): Promise<IFormDoc> {
        return await this.formDal.getForm(id)
    }
    async queryForms(filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
        try {
            return await Form.paginate(filter, options)
        } catch (error) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While querying Forms")
        }
    }

    async updateForm(formId: string, update: UpdateFormBody): Promise<IFormDoc> {
        try {
            const { fields, ...otherFields } = update
            if (otherFields) {
                if (otherFields.tenderId)
                    await this.tenderService.getTenderById((otherFields.tenderId).toString())
                return await this.formDal.updateForm(formId, otherFields)
            }
            throw new ApiError(httpStatus.BAD_REQUEST, "form update failed: unhandled form service error")
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "system error: failed to update form")
        }
    }
    async deleteForm(id: string): Promise<IFormDoc> {
        return await this.formDal.deleteForm(id)
    }

    /**
     * ----------------------------------------------------------------------------------------------------
     * only form fields
     * ----------------------------------------------------------------------------------------------------
     */
    async addFormFields(formId: string, fields: NewFormFields[]): Promise<IFormDoc> {
        try {
            await this.formDal.getForm(formId)
            const form = await this.formDal.updateForm(formId, {
                fields: fields as IFormFields[]
            }, Operation.ADD)
            return form
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "system error: failed to add form fields")
        }
    }

    async updateFormFields(formId: string, fields: IFormFields[]): Promise<IFormDoc> {
        try {
            await this.formDal.getForm(formId)
            const formQuestionIds = fields.map((question) => question.id)
            const isValidFormQuestionIds = await checkIdsInSubDocs(Form, formId, 'fields', formQuestionIds)
            if (isValidFormQuestionIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidFormQuestionIds.message)
            const form = await this.formDal.updateForm(formId, {
                fields
            }, Operation.UPDATE)
            return form
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "system error: failed to update form fields")
        }
    }
    async deleteFormFields(formId: string, fields: IFormFields[]): Promise<IFormDoc> {
        try {
            await this.formDal.getForm(formId)
            const formQuestionIds = fields.map((question) => question.id)
            const isValidFormQuestionIds = await checkIdsInSubDocs(Form, formId, 'fields', formQuestionIds)
            if (isValidFormQuestionIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidFormQuestionIds.message)
            const form = await this.formDal.updateForm(formId, {
                fields
            }, Operation.DELETE)
            return form
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "system error: failed to delete form fields")
        }
    }

}