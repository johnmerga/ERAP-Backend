import httpStatus from "http-status";
import { TenderDal } from "../dal/tender.dal";
import { ApiError } from "../errors";
import { ITenderDoc, ITenderQuery, NewTender, Tender, TenderStatus, UpdateTender } from "../model/tender";
import { IOptions, QueryResult } from "../utils";
import { ApplicantQuery, } from "../model/applicants";
import { ApplicantService } from "./applicant.service";
import { IUserDoc } from "../model/user";
import { OrgService } from "./org.service";
import { ORG_STATUS } from "../model/organization";
import { returnComparedObj } from "../utils/compareQuery";


export class TenderService {
    private tenderDal: TenderDal;
    private applicantService: ApplicantService;
    private orgService: OrgService
    constructor() {
        this.tenderDal = new TenderDal()
        this.applicantService = new ApplicantService()
        this.orgService = new OrgService()
    }

    async create(tenderBody: NewTender, user: IUserDoc): Promise<ITenderDoc> {
        const org = await this.orgService.findOrgById(user.orgId.toString())
        if (org.status !== ORG_STATUS.VERIFIED) throw new ApiError(httpStatus.BAD_REQUEST, 'Your organization is not verified, please contact the admin')
        return await this.tenderDal.create({
            ...tenderBody,
            applicants: [],
        })
    }
    async getTenderById(tenderId: string): Promise<ITenderDoc> {
        return await this.tenderDal.getTender(tenderId)
    }
    async queryTenders(filter: Record<string, any>, options: IOptions, compare?: ITenderQuery): Promise<QueryResult> {
        try {
            if (compare) {
                let comparators = returnComparedObj(compare)
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
    async queryPublishedTenders(user: IUserDoc, filter: Record<string, any>, options: IOptions, compare?: ITenderQuery,): Promise<QueryResult> {
        try {
            if (compare) {
                let comparators = returnComparedObj(compare)
                options = {
                    ...options,
                    compare: comparators
                }
            }
            const tenders = await Tender.paginate({
                ...filter,
                orgId: { $ne: user.orgId },
                status: 'PUBLISHED'
            }, options)
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

    // get only my tenders
    async queryMyTenders(user: IUserDoc, filter: Record<string, any>, options: IOptions, compare?: ITenderQuery,): Promise<QueryResult> {
        try {
            if (compare) {
                let comparators = returnComparedObj(compare)
                options = {
                    ...options,
                    compare: comparators
                }
            }
            const tenders = await Tender.paginate({
                ...filter,
                orgId: user.orgId
            }, options)
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
    async updateTender(tenderId: string, update: UpdateTender, user: IUserDoc): Promise<ITenderDoc> {
        const tender = await this.getTenderById(tenderId)
        if (tender.orgId.toString() !== user.orgId.toString()) throw new ApiError(httpStatus.BAD_REQUEST, 'You can not update a tender that is not yours')
        if (update.status && update.status !== TenderStatus.PUBLISHED) {
            if (tender.status === TenderStatus.PUBLISHED) throw new ApiError(httpStatus.BAD_REQUEST, 'You can not change the status of a published tender')
        }
        return await this.tenderDal.updateTender(tenderId, update)
    }
    async deleteTender(tenderId: string, user: IUserDoc): Promise<ITenderDoc> {
        const tender = await this.getTenderById(tenderId)
        if (tender.orgId.toString() !== user.orgId.toString()) throw new ApiError(httpStatus.BAD_REQUEST, 'You can not delete a tender that is not yours')
        return await this.tenderDal.deleteTender(tenderId)
    }
}