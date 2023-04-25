import { TenderService } from "../service";
import { catchAsync, pick } from "../utils";
import { Request, Response } from "express";
import httpStatus from "http-status";

export class TenderController {
    private tenderService: TenderService;
    constructor() {
        this.tenderService = new TenderService()
    }
    createTender = catchAsync(async (req: Request, res: Response) => {
        const tender = await this.tenderService.create(req.body)
        res.status(httpStatus.CREATED).send(tender)
    })
    getTenderById = catchAsync(async (req: Request, res: Response) => {
        const tender = await this.tenderService.getTenderById(req.params.tenderId)
        res.status(httpStatus.OK).send(tender)
    })
    getTenders = catchAsync(async (req: Request, res: Response) => {
        const filter = pick(req.query, ['orgId', 'status', 'type', 'sector'])
        const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy'])
        const tenders = await this.tenderService.queryTenders(filter, options)
        res.status(httpStatus.OK).send(tenders)
    })
    getTenderApplicants = catchAsync(async (req: Request, res: Response) => {
        const applicants = await this.tenderService.getTenderApplicants(req.params.tenderId)
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