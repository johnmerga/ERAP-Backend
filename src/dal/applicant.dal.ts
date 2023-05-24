import { Applicant, NewApplicant, IApplicantDoc, ApplicantQuery } from "../model/applicants";
import httpStatus from "http-status";
import { ApiError } from "../errors";
import { IOptions, QueryResult } from "../utils";

export class ApplicantDal {
    async create(applicant: NewApplicant): Promise<IApplicantDoc> {
        try {
            const newApplicant = await new Applicant(applicant).save()
            if (!newApplicant) throw new ApiError(httpStatus.BAD_REQUEST, 'unable to create applicant')
            return newApplicant
        } catch (error) {
            throw new Error('system error: occurred while creating applicant ')
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
    async getApplicants(filter: ApplicantQuery, options: IOptions): Promise<QueryResult> {
        try {
            const applicants = await Applicant.paginate(filter, options)
            if (!applicants) {
                throw new ApiError(httpStatus.NOT_FOUND, `something went wrong while fetching applicants`)
            }
            return applicants
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'system error: error occurred while fetching applicants')
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