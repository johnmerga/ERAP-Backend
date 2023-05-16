import { NextFunction, Request, Response } from "express";
import { FormService } from "../service";
import { catchAsync, pick } from "../utils";
import httpStatus from "http-status";
import mongoose from "mongoose";

export class FormController {
    private formService: FormService
    constructor() {
        this.formService = new FormService()
    }
    createForm = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        req.body.bidId = new mongoose.Types.ObjectId()  // <--only for testing, this should be deleted later
        const form = await this.formService.createForm(req.body)
        res.status(httpStatus.CREATED).send(form)
    })
    getForm = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const form = await this.formService.getForm(req.params.formId)
        res.status(httpStatus.OK).send(form)
    })
    queryForms = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const filter = pick(req.query, ['type', 'tenderId'])
        const options = req.query
        const result = await this.formService.queryForms(filter, options)
        res.status(httpStatus.OK).send(result)
    })
    updateForm = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const form = await this.formService.updateForm(req.params.formId, req.body)
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
        const form = await this.formService.addFormFields(req.params.formId, req.body.fields)
        res.status(httpStatus.OK).send(form)
    }
    )

    updateFormFields = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const form = await this.formService.updateFormFields(req.params.formId, req.body.fields)
        res.status(httpStatus.OK).send(form)
    })
    deleteFormFields = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const form = await this.formService.deleteFormFields(req.params.formId, req.body.fields)
        res.status(httpStatus.OK).send(form)
    })
}