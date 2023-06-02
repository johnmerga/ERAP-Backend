import httpStatus from "http-status";
import { FormDal } from "../dal/form.dal";
import { ApiError } from "../errors";
import { Form, IFormDoc, IFormFields, NewForm, NewFormFields, UpdateFormBody } from "../model/form";
import { IOptions, Operation, QueryResult, checkIdsInSubDocs, } from "../utils";
import { ApplicantService, TenderService } from "../service/";
import { IUserDoc } from "../model/user";
import { IPaymentInfoDoc, PaymentStatus } from "../model/payment";
import { ITenderDoc, TenderType } from "../model/tender";
export class FormService {
    private formDal: FormDal
    private tenderService: TenderService
    private applicantService: ApplicantService;
    constructor() {
        this.formDal = new FormDal()
        this.tenderService = new TenderService()
        this.applicantService = new ApplicantService()
    }
    async createForm(form: NewForm, user: IUserDoc): Promise<IFormDoc> {
        const tendersOrgId = ((await this.tenderService.getTenderById(form.tenderId.toString(), user)).orgId)
        // checking if the user is allowed to create a form for this tender
        if (tendersOrgId.toString() !== user.orgId.toString()) throw new ApiError(httpStatus.FORBIDDEN, `you are not allowed to create a form for this tender`)
        const forms = await Form.paginate({
            tenderId: form.tenderId,
            type: form.type
        }, {})
        if (forms.totalResults > 0) {
            throw new ApiError(httpStatus.BAD_REQUEST, `A form with type: [${form.type}] already exist for this tender: [${form.tenderId}]`)
        }
        return await this.formDal.create(form)
    }
    async getForm(formId: string, user: IUserDoc): Promise<IFormDoc> {
        try {
            const form = await this.formDal.getForm(formId)
            // checking pre condition
            if (!user.orgId) throw new ApiError(httpStatus.FAILED_DEPENDENCY, `no organization id associated with this user id : [${user.id}]`)
            if (!form.tenderId) throw new ApiError(httpStatus.PRECONDITION_FAILED, `could't process the form because the form is not linked to any tender`)
            const tender = await this.tenderService.getTenderById((form.tenderId).toString(), user)
            if (tender.orgId.toString() !== user.orgId.toString()) {
                const applicant = await ((await this.applicantService.getOneByOrgIdAndTenderId(user.orgId, form.tenderId)).populate('paymentId'))
                if (tender.type === TenderType.INVITATION) {
                    if (!applicant) throw new ApiError(httpStatus.FORBIDDEN, `you are not allowed to access this form because you are not invited for this tender`)
                    // return the form even if the payment is not successful
                    return form
                }
                const paymentInfo = applicant.paymentId as unknown as IPaymentInfoDoc
                if (paymentInfo.paymentStatus !== PaymentStatus.Success) throw new ApiError(httpStatus.PAYMENT_REQUIRED, `payment required`)
            }
            return await this.formDal.getForm(formId)
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `system error: error occured while getting a form with id: [${formId}] `)
        }
    }
    async queryForms(filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
        try {
            return await Form.paginate(filter, options)
        } catch (error) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While querying Forms")
        }
    }

    async updateForm(formId: string, update: UpdateFormBody, user: IUserDoc): Promise<IFormDoc> {
        try {
            // auth check
            const form = await (await this.formDal.getForm(formId)).populate('tenderId')
            if(!form || typeof form.tenderId === 'string' ) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `system error: failed to get tender id from form`)
            const tender = form.tenderId as unknown as ITenderDoc
            if (!tender || tender.orgId.toString() !== user.orgId.toString()) throw new ApiError(httpStatus.FORBIDDEN, `you are not allowed to update this form because you are not the owner of this tender`)
            const { fields, ...otherFields } = update
            if (otherFields) {
                if (otherFields.tenderId)
                    await this.tenderService.getTenderById((otherFields.tenderId).toString(), user)
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
    async addFormFields(formId: string, fields: NewFormFields[], user: IUserDoc): Promise<IFormDoc> {
        try {
            // await this.formDal.getForm(formId)
            // auth check
            const autForm = await (await this.formDal.getForm(formId)).populate('tenderId')
            if(!autForm || typeof autForm.tenderId === 'string' ) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `system error: failed to get tender id from form`)
            const tender = autForm.tenderId as unknown as ITenderDoc
            if (!tender || tender.orgId.toString() !== user.orgId.toString()) throw new ApiError(httpStatus.FORBIDDEN, `you are not allowed to update this form because you are not the owner of this tender`)


            const form = await this.formDal.updateForm(formId, {
                fields: fields as IFormFields[]
            }, Operation.ADD)
            return form
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "system error: failed to add form fields")
        }
    }

    async updateFormFields(formId: string, fields: IFormFields[], user: IUserDoc): Promise<IFormDoc> {
        try {
            // auth check
            const autForm = await (await this.formDal.getForm(formId)).populate('tenderId')
            if(!autForm || typeof autForm.tenderId === 'string' ) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `system error: failed to get tender id from form`)
            const tender = autForm.tenderId as unknown as ITenderDoc
            if (!tender || tender.orgId.toString() !== user.orgId.toString()) throw new ApiError(httpStatus.FORBIDDEN, `you are not allowed to update this form because you are not the owner of this tender`)

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
    async deleteFormFields(formId: string, fields: IFormFields[], user: IUserDoc): Promise<IFormDoc> {
        try {
            // auth check
            const authForm = await (await this.formDal.getForm(formId)).populate('tenderId')
            if(!authForm || typeof authForm.tenderId === 'string' ) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `system error: failed to get tender id from form`)
            const tender = authForm.tenderId as unknown as ITenderDoc
            if (!tender || tender.orgId.toString() !== user.orgId.toString()) throw new ApiError(httpStatus.FORBIDDEN, `you are not allowed to update this form because you are not the owner of this tender`)

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