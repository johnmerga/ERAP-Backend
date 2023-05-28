import { Tender, ITenderDoc, NewTender, NewTenderInput, } from "../model/tender";
import httpStatus from "http-status";
import { ApiError } from "../errors";


export class TenderDal {
    async create(tender: NewTenderInput): Promise<ITenderDoc> {
        try {
            return (await Tender.create(tender)).save()
        } catch (error) {
            throw new Error('error occurred while creating tender ')
        }
    }
    async getTender(id: string): Promise<ITenderDoc> {
        try {
            const tender = await Tender.findById(id);
            if (!tender) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Tender not found')
            }
            return tender;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while fetching tender')

        }
    }

    async updateTender(id: string, update: Partial<NewTender>): Promise<ITenderDoc> {
        try {
            const tender = await Tender.findById(id)
            if (!tender) {
                throw new ApiError(httpStatus.NOT_FOUND, "There's no tender found to update")
            }
            tender.set(update)
            return tender.save()
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while updating tender')

        }
    }

    async deleteTender(id: string): Promise<ITenderDoc> {
        try {

            const tender = await Tender.findByIdAndDelete(id)
            if (!tender) {
                throw new ApiError(httpStatus.NOT_FOUND, 'the tender you are trying to delete does not exist or may have already')
            }
            return tender
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while deleting tender')

        }
    }
}