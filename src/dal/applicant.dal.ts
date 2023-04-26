import { Applicant, NewApplicant, IApplicantDoc, ApplicantQuery } from "../model/applicants";
import httpStatus from "http-status";
import { ApiError } from "../errors";

export class ApplicantDal {
    async create(applicant: NewApplicant): Promise<IApplicantDoc> {
        try {
            return (await Applicant.create(applicant)).save()
        } catch (error) {
            throw new Error('error occurred while creating applicant ')
        }
    }
    async getApplicant(id: string): Promise<IApplicantDoc> {
        try {
            const applicant = await Applicant.findById(id);
            if (!applicant) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Applicant not found')
            }
            return applicant;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while fetching applicant')

        }
    }
    async getApplicants(filter: ApplicantQuery): Promise<IApplicantDoc[]> {
        try {
            const applicants = await Applicant.find(filter)
            if (!applicants || applicants.length === 0) {
                throw new ApiError(httpStatus.NOT_FOUND, 'no applicants found for this tender')
            }
            return applicants
        } catch (error) {
            if(error instanceof ApiError){
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while fetching applicants for specific tender')
        }
    }
    async deleteApplicant(id: string): Promise<IApplicantDoc> {
        try {
            const applicant = await Applicant.findByIdAndDelete(id)
            if (!applicant) {
                throw new ApiError(httpStatus.NOT_FOUND, 'the applicant you are trying to delete does not exist or may have already')
            }
            return applicant
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while deleting applicant')
        }
    }
}