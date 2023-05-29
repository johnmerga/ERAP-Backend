import { ApiError } from "../errors";
import { ApplicantService, TenderService } from "../service";
import { catchAsync, pick } from "../utils";
import { Request, Response } from "express";
import httpStatus from "http-status";

export class TenderController {
    private tenderService: TenderService;
    private applicantService: ApplicantService;
    constructor() {
        this.tenderService = new TenderService()
        this.applicantService = new ApplicantService()
    }
    createTender = catchAsync(async (req: Request, res: Response) => {
        if (!req.user?.orgId) throw new ApiError(httpStatus.BAD_REQUEST, 'user with no organization cannot create tender')
        const tender = await this.tenderService.create({
            ...req.body,
            orgId: req.user?.orgId
        })
        res.status(httpStatus.CREATED).send(tender)
    })
    getTenderById = catchAsync(async (req: Request, res: Response) => {
        const tender = await this.tenderService.getTenderById(req.params.tenderId)
        res.status(httpStatus.OK).send(tender)
    })
    getTenders = catchAsync(async (req: Request, res: Response) => {
        const filter = pick(req.query, ['orgId', 'status', 'type', 'sector',])
        const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'search'])
        const compare = req.body
        const tenders = await this.tenderService.queryTenders(filter, options, compare)
        res.status(httpStatus.OK).send(tenders)
    })
    getTenderApplicants = catchAsync(async (req: Request, res: Response) => {
        const filter = pick(req.query, ['orgId', 'isApplicationSubmitted'])
        const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate'])
        const applicants = await this.applicantService.getAllApplicantForOneTender({
            ...filter,
            tenderId: req.params.tenderId
        }, {
            ...options,
            populate: `orgId.name,tenderId.title`
        })
        res.status(httpStatus.OK).send(applicants)
    })
    updateTender = catchAsync(async (req: Request, res: Response) => {
        const tender = await this.tenderService.updateTender(req.params.tenderId, req.body)
        res.status(httpStatus.OK).send(tender)
    })
    deleteTender = catchAsync(async (req: Request, res: Response) => {
        await this.tenderService.deleteTender(req.params.tenderId)
        res.status(httpStatus.OK).send()
    })
}