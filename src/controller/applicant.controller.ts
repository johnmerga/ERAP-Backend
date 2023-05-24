import { catchAsync, pick } from "../utils";
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
    getApplicantsByTenderId = catchAsync(async (req: Request, res: Response) => {
        const filter = pick(req.query, ['orgId', 'isApplicationSubmitted'])
        const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate'])
        const applicant = await this.applicantService.getAllApplicantForOneTender({
            ...filter,
            tenderId: req.params.tenderId
        }, options)
        res.status(httpStatus.OK).send(applicant)
    })
    deleteApplicant = catchAsync(async (req: Request, res: Response) => {
        await this.applicantService.deleteApplicant(req.params.applicantId)
        res.status(httpStatus.OK).send()
    })
}