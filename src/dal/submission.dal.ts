import httpStatus from "http-status";
import { ApiError } from "../errors";
import { ISubmission, ISubmissionDoc, Submission, UpdateSubmissionBody, } from "../model/submission";

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
    async updateSubmission(submissionId: string, update: UpdateSubmissionBody): Promise<ISubmissionDoc> {
        try {
            const submission = await Submission.findById(submissionId)
            if (!submission) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Submission not found")
            }

            // take everything except answers
            const { answers, ...rest } = update
            Object.assign(submission, rest)
            if (update.answers) {
                for (const answer of update.answers) {
                    const answerIndex = submission.answers.findIndex((ans) => ans.id === answer.id)
                    if (answerIndex === -1) {
                        submission.answers.push(answer)
                    } else {
                        submission.answers[answerIndex] = answer
                    }
                }
            }
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