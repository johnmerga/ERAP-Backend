import httpStatus from "http-status";
import { TenderDal } from "../dal/tender.dal";
import { ApiError } from "../errors";
import { ITenderDoc, ITenderQuery, NewTender, Tender, UpdateTender } from "../model/tender";
import { IOptions, QueryResult } from "../utils";
import { ApplicantQuery, } from "../model/applicants";
import { ApplicantService } from "./applicant.service";
import moment from "moment";


export class TenderService {
    private tenderDal: TenderDal;
    private applicantService: ApplicantService;
    constructor() {
        this.tenderDal = new TenderDal()
        this.applicantService = new ApplicantService()
    }

    async create(tenderBody: NewTender): Promise<ITenderDoc> {
        return await this.tenderDal.create({
            ...tenderBody,
            applicants: [],
        })
    }
    async getTenderById(tenderId: string): Promise<ITenderDoc> {
        return await this.tenderDal.getTender(tenderId)
    }
    async queryTenders(filter: Record<string, any>, options: IOptions, compare?: ITenderQuery): Promise<Record<string, any>> {
        try {
            if (compare) {
                let comparators = {}
                if (compare.openDate) {
                    compare.openDate[0] ? moment(compare.openDate[0]).toDate() : undefined
                    compare.openDate[1] ? moment(compare.openDate[1]).toDate() : undefined
                    comparators = {
                        ...comparators,
                        openDate: [compare.openDate[0], compare.openDate[1]]
                    }
                }
                if (compare.bidDeadline) {
                    compare.bidDeadline[0] ? moment(compare.bidDeadline[0]).toDate() : undefined
                    compare.bidDeadline[1] ? moment(compare.bidDeadline[1]).toDate() : undefined
                    comparators = {
                        ...comparators,
                        bidDeadline: [compare.bidDeadline[0], compare.bidDeadline[1]]
                    }
                }
                if (compare.closeDate) {
                    compare.closeDate[0] ? moment(compare.closeDate[0]).toDate() : undefined
                    compare.closeDate[1] ? moment(compare.closeDate[1]).toDate() : undefined
                    comparators = {
                        ...comparators,
                        closeDate: [compare.closeDate[0], compare.closeDate[1]]
                    }
                }
                if (compare.price) {
                    compare.price[0] ? compare.price[0] : undefined
                    compare.price[1] ? compare.price[1] : undefined
                    comparators = {
                        ...comparators,
                        price: [compare.price[0], compare.price[1]]
                    }
                }
                options = {
                    ...options,
                    compare: comparators
                }
            }
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