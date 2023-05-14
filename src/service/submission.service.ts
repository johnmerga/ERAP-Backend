import { SubmissionDAL } from "../dal";
import { AnswerEvaluation, IAnswer, IAnswerDoc, ISubmission } from "../model/submission"
import { ApiError } from "../errors";
import httpStatus from "http-status";
import { ISubmissionDoc, Submission, UpdateSubmissionBody } from "../model/submission";
import { IOptions, Operation, QueryResult, subDocumentOperationIdentifier } from "../utils";
import { Tender } from "../model/tender";
import { Organization } from "../model/organization";
import { IFormDoc, IFormFieldsDoc, Form } from "../model/form";
import { checkIdsInSubDocs } from "../utils/";
// import { Logger } from "../logger";

export class SubmissionService {
    private submissionDAL: SubmissionDAL
    constructor() {
        this.submissionDAL = new SubmissionDAL()
    }
    // check if questionIds are valid
    async checkQuestionIds(questionIds: string[]): Promise<boolean> {
        try {
            const questions = await Form.find({ "fields._id": { $in: questionIds } })
            if (questions.length !== questionIds.length) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Question Ids")
            }
            return true
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While checking Question Ids")
        }
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
            if (submission.answers.length === 0) throw new ApiError(httpStatus.BAD_REQUEST, "Answers are required")
            // const isValidQuestionIds = await this.checkQuestionIds(submission.answers.map((answer) => answer.questionId))
            const submissionAnswers = submission.answers.map((answer) => answer.questionId)
            const isValidQuestionIds = await checkIdsInSubDocs(Form, submission.formId, 'fields', submissionAnswers)
            if (!isValidQuestionIds) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Question Ids")
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
            let submission = await this.submissionDAL.findSubmission(submissionId)
            if (!submission) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Submission not found")
            }
            //
            await this.checkBidFormOrg({
                formId: update.formId,
                orgId: update.orgId,
                tenderId: update.tenderId
            })
            // take everything except answers
            const { answers, ...rest } = update
            // check if rest is not empty
            if (rest && Object.keys(rest).length > 0) {
                await Submission.updateOne({ _id: submissionId }, { $set: rest })
            }
            /*
             */
            // checking if the questionIds and question ids are valid
            if (update.answers && update.answers.length > 0) {
                const operations = subDocumentOperationIdentifier(update.answers)
                const submissionAnswerIds = update.answers.map((answer) => answer.id)

                // check if the ids of the answers are valid
                if (submissionAnswerIds[0]) {
                    const isValidAnswerIds = await checkIdsInSubDocs(Submission, submissionId, 'answers', submissionAnswerIds)
                    if (isValidAnswerIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidAnswerIds.message)
                }
                // check if the update is to delete answers
                if (operations.listsToBeDeleted.length > 0) {
                    //
                    return await this.submissionDAL.updateSubmission(submissionId, {
                        answers: operations.listsToBeDeleted as IAnswer[]
                    }, Operation.DELETE)
                }

                // check if the ids of questions id are valid
                const submissionsAnswersQuestionsId = update.answers.map((answer) => answer.questionId)
                if (submissionsAnswersQuestionsId[0]) {
                    const isValidQuestionIds = await checkIdsInSubDocs(Form, submission.formId, 'fields', submissionsAnswersQuestionsId)
                    if (isValidQuestionIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidQuestionIds.message)
                } submissionsAnswersQuestionsId

                // check if the update is to update answers
                if (operations.listsToBeUpdated.length > 0) {
                    return await this.submissionDAL.updateSubmission(submissionId, {
                        answers: operations.listsToBeUpdated as IAnswer[]
                    }, Operation.UPDATE)
                }
                // check if the questionIds are valid
                if (!submissionsAnswersQuestionsId[0]) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Question Ids")
                // check if the update is to add answers
                if (operations.listsToBeAdded.length > 0) {

                    return await this.submissionDAL.updateSubmission(submissionId, {
                        answers: operations.listsToBeAdded as IAnswer[]
                    }, Operation.ADD)
                }
            }
            submission = await this.submissionDAL.findSubmission(submissionId)
            return submission
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While updating Submission")
        }

    }
    // evaluation mark for answers
    async giveMark(submissionId: string, marks: AnswerEvaluation[]): Promise<ISubmissionDoc> {
        try {
            const submission = await Submission.findById(submissionId)
            if (!submission) throw new ApiError(httpStatus.NOT_FOUND, 'unable to give mark: submission not found')
            for (const answer of marks) {
                // destructuring a single answer
                const { mark, id } = answer
                const answerIndex = submission.answers.findIndex((answer) => answer.id === id)
                if (answerIndex === -1) {
                    throw new ApiError(httpStatus.NOT_FOUND, `unable to find answer with id: ${id}`)
                }
                submission.answers[answerIndex].mark = mark
                let totalMark = 0;
                submission.answers.forEach((answer) => {
                    totalMark += answer.mark
                })
                // convert to percentage

                submission.score = (totalMark / (submission.answers.length * 10)) * 100

            }
            submission.updatedAt = new Date()
            await submission.save()
            return submission
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error occured while giving a mark for Submissions ')
        }
    }
    // delete submission
    async deleteSubmission(submissionId: string): Promise<ISubmission> {
        return await this.submissionDAL.deleteSubmission(submissionId)
    }

    // populate answers with question
    async getSubmissionWithQuestion(submissionId: string) {
        try {
            const submission = await Submission.findById(submissionId).populate('formId')
            if (!submission) throw new ApiError(httpStatus.NOT_FOUND, 'unable to get submission: submission not found')
            if (typeof submission.formId === 'string') throw new Error('formId is not populated')
            const form = submission.formId as IFormDoc
            const submissionAnswers = submission.answers
            const formQuestions = form.fields
            const populatedAnswers = submissionAnswers.map((answer) => {
                const question = formQuestions.find((question) => {
                    let hydratedQuestion = question as IFormFieldsDoc
                    hydratedQuestion = hydratedQuestion.toObject()
                    return hydratedQuestion._id == answer.questionId ? answer : null
                })
                if (!question) throw new ApiError(httpStatus.NOT_FOUND, `unable to find question with id: ${answer.questionId}`)
                const jsonAnswer = answer as IAnswerDoc
                const jsonQuestion = question as IFormFieldsDoc

                return {
                    ...jsonAnswer.toObject(),
                    question: jsonQuestion.toObject()
                }
            }
            )
            return populatedAnswers
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While populating answers with question")
        }
    }
}
