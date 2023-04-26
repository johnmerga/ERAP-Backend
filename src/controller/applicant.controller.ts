import { catchAsync } from "../utils";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { ApplicantService } from "../service";

export class ApplicantController {
    private applicantService: ApplicantService;
    constructor() {
        this.applicantService = new ApplicantService()
    }
    createApplicant = catchAsync(async (req: Request, res: Response) => {
        const applicant = await this.applicantService.create(req.body)
        res.status(httpStatus.CREATED).send(applicant)
    })
    getApplicantById = catchAsync(async (req: Request, res: Response) => {
        const applicant = await this.applicantService.getApplicantById(req.params.applicantId)
        res.status(httpStatus.OK).send(applicant)
    })
    deleteApplicant = catchAsync(async (req: Request, res: Response) => {
        await this.applicantService.deleteApplicant(req.params.applicantId)
        res.status(httpStatus.OK).send()
    })
}