import { Applicant, ApplicantForOneTender, ApplicantQuery, IApplicantDoc, NewApplicant, } from "../model/applicants";
import { ApplicantDal } from "../dal";
import { IOptions, QueryResult } from "../utils";
import mongoose from "mongoose";
import { ApiError } from "../errors";
import httpStatus from "http-status";

export class ApplicantService {
    private applicantDal: ApplicantDal;
    constructor() {
        this.applicantDal = new ApplicantDal()
    }

    async create(applicantBody: NewApplicant): Promise<IApplicantDoc> {
        return await this.applicantDal.create(applicantBody)
    }
    async getByOrgIdAndTenderIdList(orgId: string, tenderId: string): Promise<QueryResult> {
        const applicant = await this.applicantDal.getApplicants({ orgId: new mongoose.Types.ObjectId(orgId), tenderId: new mongoose.Types.ObjectId(tenderId) }, {})
        return applicant
    }
    async getOneByOrgIdAndTenderId(orgId: mongoose.Types.ObjectId, tenderId: mongoose.Types.ObjectId): Promise<IApplicantDoc> {
        try {
            const applicant = await Applicant.findOne({ orgId, tenderId })
            if (!applicant) throw new ApiError(httpStatus.NOT_FOUND, 'Applicant not found')
            return applicant
        } catch (error) {
            if (error instanceof ApiError) throw error  
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while fetching applicant')
        }
    }
    async getApplicantById(applicantId: string): Promise<IApplicantDoc> {
        return await this.applicantDal.getApplicant(applicantId)
    }
    async getAllApplicantForOneTender(filter: ApplicantQuery, options: IOptions): Promise<QueryResult> {
        const applicants = await this.applicantDal.getApplicants(filter, options)
        return applicants
    }
    async getSubmittedApplicantForOneTender(filter: ApplicantForOneTender): Promise<QueryResult> {
        const applicants = await this.applicantDal.getApplicants(filter, {})
        return applicants
    }
    async deleteApplicant(applicantId: string): Promise<IApplicantDoc> {
        return await this.applicantDal.deleteApplicant(applicantId)
    }
}