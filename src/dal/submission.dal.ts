import httpStatus from "http-status";
import { ApiError } from "../errors";
import { ISubmission, ISubmissionDoc, Submission, UpdateSubmissionBody, } from "../model/submission";
import { Operation, updateSubDocuments } from "../utils/updateSubDocs";

export class SubmissionDAL {
    async create(submission: ISubmission): Promise<any> {
        try {
            const newSubmission = await new Submission(submission).save()
            if (!newSubmission) {
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "form submission was unsuccessful")
            }
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While crating Submission")
        }
    }
    async findSubmission(submissionId: string): Promise<ISubmissionDoc> {
        try {
            const submission = await Submission.findById(submissionId)
            if (!submission) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Submission not found")
            }
            return submission
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While finding Submission")
        }
    }
    async updateSubmission(submissionId: string, update: UpdateSubmissionBody, subDocOperation?: Operation): Promise<ISubmissionDoc> {
        try {
            const { answers, } = update
            if (answers && answers.length > 0) {

                const subDocUpdates = answers.map(({ id, ...otherFields }) => ({
                    id,
                    update: {
                        _id: id,
                        ...otherFields
                    }
                }))
                const isSubDocSaved = await updateSubDocuments(Submission, submissionId, 'answers', subDocUpdates, subDocOperation ?? Operation.UPDATE)
                if (isSubDocSaved instanceof Error) {
                    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, isSubDocSaved.message)
                }
                return isSubDocSaved

            }
            // refresh the latest submission
            const submission = await Submission.findById(submissionId)
            if (!submission) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `failed to refresh submission: ${submissionId}`)
            submission.updatedAt = new Date()
            await submission.save()
            return submission
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While finding Submission")
        }
    }
    async deleteSubmission(submissionId: string): Promise<ISubmissionDoc> {
        try {
            const submission = await Submission.findByIdAndDelete(submissionId)
            if (!submission) throw new ApiError(httpStatus.NOT_FOUND, 'unable to delete submission: submission not found')
            return submission
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While deleting Submission")
        }
    }
}