import { ApplicantForOneTender, ApplicantQuery, IApplicantDoc, NewApplicant, } from "../model/applicants";
import { ApplicantDal } from "../dal";
import { IOptions, QueryResult } from "../utils";

export class ApplicantService {
    private applicantDal: ApplicantDal;
    constructor() {
        this.applicantDal = new ApplicantDal()
    }

    async create(applicantBody: NewApplicant): Promise<IApplicantDoc> {
        return await this.applicantDal.create(applicantBody)
    }
    async getByOrgIdAndTenderId(orgId: string, tenderId: string): Promise<QueryResult> {
        const applicant = await this.applicantDal.getApplicants({ orgId, tenderId }, {})
        return applicant
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