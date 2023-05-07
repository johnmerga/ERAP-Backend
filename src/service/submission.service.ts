import { SubmissionDAL } from "../dal";
import { AnswerEvaluation, ISubmission } from "../model/submission"
import { ApiError } from "../errors";
import httpStatus from "http-status";
import { ISubmissionDoc, Submission, UpdateSubmissionBody } from "../model/submission";
import { IOptions, QueryResult } from "../utils";
import { Tender } from "../model/tender";
import { Form } from "../model/form";
import { Organization } from "../model/organization";

export class SubmissionService {
    private submissionDAL: SubmissionDAL
    constructor() {
        this.submissionDAL = new SubmissionDAL()
    }
    //checker function for if the bidId,formId, orgId are valid
    async checkBidFormOrg({ tenderId, formId, orgId }: Partial<Record<'orgId' | 'formId' | 'tenderId', string>>): Promise<boolean> {
        try {
            const invalidTypes: string[] = [];
            if (tenderId) {
                const tender = await Tender.findById(tenderId);
                if (!tender) invalidTypes.push(`tenderId: ${tenderId}`);
            }
            if (formId) {
                const form = await Form.findById(formId);
                if (!form) invalidTypes.push(`formId: ${formId}`);
            }
            if (orgId) {
                const org = await Organization.findById(orgId);
                if (!org) invalidTypes.push(`orgId: ${orgId}`);
            }
            if (invalidTypes.length > 0) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    `Invalid Ids: ${invalidTypes.join(", ")}`
                );
            }
            return true;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While checking Bid, Form, Org");
        }
    }
    async create(submission: ISubmission): Promise<ISubmissionDoc> {
        try {
            await this.checkBidFormOrg({
                formId: submission.formId,
                orgId: submission.orgId,
                tenderId: submission.tenderId
            })
            return await this.submissionDAL.create(submission)
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While creating Submission")
        }
    }
    async findSubmission(submissionId: string): Promise<ISubmission> {
        return await this.submissionDAL.findSubmission(submissionId)
    }
    async querySubmissions(filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
        try {
            return await Submission.paginate(filter, options)
        } catch (error) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While querying Submissions")
        }
    }
    // update submission
    async updateSubmission(submissionId: string, update: UpdateSubmissionBody): Promise<ISubmissionDoc> {
        try {
            await this.checkBidFormOrg({
                formId: update.formId,
                orgId: update.orgId,
                tenderId: update.tenderId
            })

            return await this.submissionDAL.updateSubmission(submissionId, update)
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While updating Submission")
        }

    }
    // evaluation mark for answers
    async giveMark(submissionId: string, marks: AnswerEvaluation[]): Promise<ISubmissionDoc> {
        try {
            const submission = await Submission.findById(submissionId)
            if (!submission) throw new ApiError(httpStatus.NOT_FOUND, 'unable to delete answers: submission not found')
            for (const answer of marks) {
                const { mark, id } = answer
                const answerIndex = submission.answers.findIndex((answer) => answer.id === id)
                if (answerIndex === -1) {
                    throw new ApiError(httpStatus.NOT_FOUND, `unable to find answer with id: ${id}`)
                }
                submission.answers[answerIndex].mark = mark
            }
            submission.updatedAt = new Date()
            await submission.save()
            return submission
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error occured while giving a mark for Submissions ')
        }
    }
    // delete answers 
    async deleteAnswers(submissionId: string, answerIds: string[]): Promise<void> {
        try {
            const submission = await Submission.findById(submissionId)
            if (!submission) throw new ApiError(httpStatus.NOT_FOUND, 'unable to delete answers: submission not found')
            answerIds.forEach((answerId) => {
                const answerIndex = submission.answers.findIndex((ans) => ans.id === answerId)
                if (answerIndex !== -1) {
                    submission.answers.splice(answerIndex, 1)
                }
            })
            await submission.save()
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While deleting answers")
        }
    }
    async deleteSubmission(submissionId: string): Promise<ISubmission> {
        return await this.submissionDAL.deleteSubmission(submissionId)
    }
}
