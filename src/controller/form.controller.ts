import { NextFunction, Request, Response } from "express";
import { FormService } from "../service";
import { catchAsync, pick } from "../utils";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { ApiError } from "../errors";

export class FormController {
    private formService: FormService
    constructor() {
        this.formService = new FormService()
    }
    createForm = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // check if it has an organization id and if the user exists
        if (!req.user || !req.user.orgId) throw new ApiError(httpStatus.BAD_REQUEST, `user does not have an organization id or user does not exist`)
        req.body.bidId = new mongoose.Types.ObjectId()  // <--only for testing, this should be deleted later
        const form = await this.formService.createForm(req.body, req.user)
        res.status(httpStatus.CREATED).send(form)
    })
    getForm = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const form = await this.formService.getForm(req.params.formId, req.user!)
        res.status(httpStatus.OK).send(form)
    })
    getBoughtTenderForms = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.orgId) throw new ApiError(httpStatus.BAD_REQUEST, `user does not have an organization id or user does not exist`)
        const filter = pick(req.query, ['type', 'tenderId'])
        const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate'])
        const result = await this.formService.getBoughtTenderForms(filter, options, req.user)
        res.status(httpStatus.OK).send(result)
    })
    queryForms = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const filter = pick(req.query, ['type', 'tenderId'])
        const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate'])
        const result = await this.formService.queryForms(filter, options)
        res.status(httpStatus.OK).send(result)
    })
    updateForm = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) throw new ApiError(httpStatus.BAD_REQUEST, 'you have to be logged in to access this route')
        const form = await this.formService.updateForm(req.params.formId, req.body, req.user)
        res.status(httpStatus.OK).send(form)
    })
    deleteForm = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await this.formService.deleteForm(req.params.formId)
        res.status(httpStatus.OK).send()
    })


    /**
     * ----------------------------------------------------------------------------------------------------
     * only form fields 
     * ----------------------------------------------------------------------------------------------------
     */
    addFormFields = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) throw new ApiError(httpStatus.BAD_REQUEST, 'you have to be logged in to access this route')
        const form = await this.formService.addFormFields(req.params.formId, req.body.fields, req.user)
        res.status(httpStatus.OK).send(form)
    }
    )

    updateFormFields = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) throw new ApiError(httpStatus.BAD_REQUEST, 'you have to be logged in to access this route')

        const form = await this.formService.updateFormFields(req.params.formId, req.body.fields, req.user)
        res.status(httpStatus.OK).send(form)
    })
    deleteFormFields = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) throw new ApiError(httpStatus.BAD_REQUEST, 'you have to be logged in to access this route')

        const form = await this.formService.deleteFormFields(req.params.formId, req.body.fields, req.user)
        res.status(httpStatus.OK).send(form)
    })
}