import {  ApplicantQuery, IApplicantDoc, NewApplicant, } from "../model/applicants";
import { ApplicantDal } from "../dal";

export class ApplicantService {
    private applicantDal: ApplicantDal;
    constructor() {
        this.applicantDal = new ApplicantDal()
    }

    async create(applicantBody: NewApplicant): Promise<IApplicantDoc> {
        return await this.applicantDal.create(applicantBody)
    }
    async getApplicantById(applicantId: string): Promise<IApplicantDoc> {
        return await this.applicantDal.getApplicant(applicantId)
    }
    async getApplicantForOneTender(filter: ApplicantQuery): Promise<IApplicantDoc[]> {
            const applicants = await this.applicantDal.getApplicants(filter)
            return applicants
    }
    async deleteApplicant(applicantId: string): Promise<IApplicantDoc> {
        return await this.applicantDal.deleteApplicant(applicantId)
    }
}