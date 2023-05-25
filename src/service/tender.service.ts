import httpStatus from "http-status";
import { TenderDal } from "../dal/tender.dal";
import { ApiError } from "../errors";
import { ITenderDoc, NewTender, Tender, UpdateTender } from "../model/tender";
import { IOptions, QueryResult } from "../utils";
import { ApplicantQuery, } from "../model/applicants";
import { ApplicantService } from "./applicant.service";


export class TenderService {
    private tenderDal: TenderDal;
    private applicantService: ApplicantService;
    constructor() {
        this.tenderDal = new TenderDal()
        this.applicantService = new ApplicantService()
    }

    async create(tenderBody: NewTender): Promise<ITenderDoc> {
        return await this.tenderDal.create(tenderBody)
    }
    async getTenderById(tenderId: string): Promise<ITenderDoc> {
        return await this.tenderDal.getTender(tenderId)
    }
    async queryTenders(filter: Record<string, any>, options: IOptions): Promise<Record<string, any>> {
        try {
            const tenders = await Tender.paginate(filter, options)
            if (!tenders) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Tenders not found')
            }
            return tenders
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong')
        }
    }
    async getTenderApplicants(tenderId: string): Promise<QueryResult> {
        const tender = await this.getTenderById(tenderId)
        const applicantQuery: ApplicantQuery = {
            tenderId: tender.id,
            orgId: tender.orgId.toString()
        }
        const applicants = await this.applicantService.getAllApplicantForOneTender(applicantQuery, {})
        return applicants
    }
    async updateTender(tenderId: string, update: UpdateTender): Promise<ITenderDoc> {
        return await this.tenderDal.updateTender(tenderId, update)
    }
    async deleteTender(tenderId: string): Promise<ITenderDoc> {
        return await this.tenderDal.deleteTender(tenderId)
    }
}