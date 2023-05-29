import { SubmissionDAL } from "../dal";
import { AnswerEvaluation, IAnswer, IAnswerDoc, ISubmission, NewSubmissionValidator } from "../model/submission"
import { ApiError } from "../errors";
import httpStatus from "http-status";
import { ISubmissionDoc, Submission, UpdateSubmissionBody } from "../model/submission";
import { IOptions, Operation, QueryResult, } from "../utils";
import { Tender } from "../model/tender";
import { Organization } from "../model/organization";
import { IFormDoc, IFormFieldsDoc, Form } from "../model/form";
import { checkIdsInSubDocs } from "../utils/";
import { TenderService } from "./tender.service";
import { IUserDoc } from "../model/user";
// import { Logger } from "../logger";

export class SubmissionService {
    private submissionDAL: SubmissionDAL;
    private tenderService: TenderService;
    constructor() {
        this.submissionDAL = new SubmissionDAL();
        this.tenderService = new TenderService();
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
    async create(submission: NewSubmissionValidator, user: IUserDoc): Promise<ISubmissionDoc> {
        try {
            const tenderOrgId = (await this.tenderService.getTenderById(submission.tenderId)).orgId
            if (!tenderOrgId || tenderOrgId === user.orgId.toString()) throw new ApiError(httpStatus.BAD_REQUEST, "You can't bid on your own tender or ")
            await this.checkBidFormOrg({
                formId: submission.formId,
                orgId: user.orgId.toString(),
                tenderId: submission.tenderId
            })
            if (submission.answers.length === 0) throw new ApiError(httpStatus.BAD_REQUEST, "Answers are required")
            // const isValidQuestionIds = await this.checkQuestionIds(submission.answers.map((answer) => answer.questionId))
            const submissionAnswers = submission.answers.map((answer) => answer.questionId)
            const isValidQuestionIds = await checkIdsInSubDocs(Form, submission.formId, 'fields', submissionAnswers)
            if (!isValidQuestionIds || isValidQuestionIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Question Ids")
            return await this.submissionDAL.create({
                ...submission,
                orgId: user.orgId.toString()
            })
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
    /**
     * this function is used to update the submission except the answers
     */
    async updateSubmission(submissionId: string, update: UpdateSubmissionBody): Promise<ISubmissionDoc> {
        try {
            const submission = await this.submissionDAL.findSubmission(submissionId)

            await this.checkBidFormOrg({
                formId: update.formId,
                orgId: update.orgId,
                tenderId: update.tenderId
            })
            // take everything except answers
            const { answers, ...rest } = update
            // check if rest is not empty
            if (rest && Object.keys(rest).length > 0) {
                return await submission.set(rest).save()
            }
            throw new ApiError(httpStatus.BAD_REQUEST, "submission update failed: unhandled error")
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While updating Submission")
        }

    }
    // evaluation mark for answers
    async giveMark(submissionId: string, marks: AnswerEvaluation[]): Promise<ISubmissionDoc> {
        try {
            const submission = await this.submissionDAL.findSubmission(submissionId)

            const submissionWithForm = (await submission.populate('formId'))
            const form = submissionWithForm.formId as unknown as IFormDoc
            const totalValues = (await Form.aggregate([
                { $match: { _id: form._id } },
                {
                    $project: {
                        totalValue: {
                            $sum: "$fields.value"
                        }
                    }
                }
            ]))[0].totalValue
            if (!(typeof totalValues === 'number') || totalValues < 1) throw new ApiError(httpStatus.BAD_REQUEST, "unable to give mark: total values are empty or less than 1")
            //@ts-ignore
            const formQuestions = form.fields as IFormFieldsDoc[];

            // check if the formQuestions are not empty or undefined
            if (!formQuestions || formQuestions.length === 0) throw new ApiError(httpStatus.BAD_REQUEST, "unable to give mark: form questions are empty")
            // destructuring the formQuestions to get the id and value
            const fieldIdAndValue = formQuestions.map((question) => ({
                id: question._id.toString(),
                value: question.value
            }))
            // destructuring the submission answers to get the id and questionId
            const submissionQuestionId = submission.answers.map((answer) => {
                return {
                    subAnsId: answer.id,
                    questionId: answer.questionId.toString()
                }
            })
            // filter the submissionQuestionId to get the matching questionId
            const filteredSubmissionQuestionId = submissionQuestionId.filter((subAns) =>
                fieldIdAndValue.some((field) => field.id === subAns.questionId)
            );
            // map the filteredSubmissionQuestionId to get the subAnsId, formFieldId, formFieldValue
            const fieldIdAndValueMatchingSubmission = fieldIdAndValue.map((field) => {
                const matchingSubmission = filteredSubmissionQuestionId.find(
                    (subAns) => subAns.questionId === field.id
                );

                if (matchingSubmission) {
                    return {
                        subAnsId: matchingSubmission.subAnsId,
                        formFieldId: field.id,
                        formFieldValue: field.value,
                    };
                }
                return undefined;
            }).filter((field) => field !== undefined);

            if (!fieldIdAndValueMatchingSubmission || fieldIdAndValueMatchingSubmission.length === 0) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    "Unable to give mark: no matching question found"
                );
            }
            if (fieldIdAndValueMatchingSubmission.length === 0) throw new ApiError(httpStatus.BAD_REQUEST, "unable to give mark: no matching question found")
            marks.forEach((mark) => {
                fieldIdAndValueMatchingSubmission.forEach((field) => {
                    if (!field) throw new ApiError(httpStatus.BAD_REQUEST, "unable to give mark: no matching question found")
                    // if (field.id === mark.id && mark.mark > field.value) throw new ApiError(httpStatus.BAD_REQUEST, `unable to give mark: mark is greater than the value of the question with id: ${field.id}`)
                    if (field.subAnsId === mark.id && mark.mark > field.formFieldValue) throw new ApiError(httpStatus.BAD_REQUEST, `unable to give mark: mark is greater than the value of the question with id: ${field.formFieldId}`)
                })
            })

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
                // convert to percentage and convert to 2 decimal places
                submission.score = Number(((totalMark / totalValues) * 100).toFixed(2))

            }
            submission.updatedAt = new Date()
            await submission.save()
            return await this.submissionDAL.findSubmission(submissionId)
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

    /**
     * ----------------------------------------------------------------------------------------------------
     * the following functions are only for answers
     * ----------------------------------------------------------------------------------------------------
     */

    // add submission answers
    async addAnswers(submissionId: string, answers: IAnswer[]): Promise<ISubmissionDoc> {
        try {
            const submission = await this.findSubmission(submissionId)
            // check if the questionIds are valid
            const submissionsAnswersQuestionsIds = answers.map((answer) => answer.questionId)
            const isValidQuestionIds = await checkIdsInSubDocs(Form, submission.formId, 'fields', submissionsAnswersQuestionsIds)
            if (isValidQuestionIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidQuestionIds.message)
            // add answers
            return await this.submissionDAL.updateSubmission(submissionId, {
                answers
            }, Operation.ADD)

        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "system Error: Error Happened While adding answers")
        }
    }
    // update submission answers
    async updateAnswers(submissionId: string, answers: IAnswer[]): Promise<ISubmissionDoc> {
        try {
            const submission = await this.findSubmission(submissionId)
            //check if the answerIds are valid
            const submissionAnswersIds = submission.answers.map((answer) => answer.id)
            const isValidAnswerIds = await checkIdsInSubDocs(Submission, submissionId, 'answers', submissionAnswersIds)
            if (isValidAnswerIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidAnswerIds.message)
            // check if the questionIds are valid
            const submissionsAnswersQuestionsIds = answers.map((answer) => answer.questionId)
            const isValidQuestionIds = await checkIdsInSubDocs(Form, submission.formId, 'fields', submissionsAnswersQuestionsIds)
            if (isValidQuestionIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidQuestionIds.message)
            // update answers
            return await this.submissionDAL.updateSubmission(submissionId, {
                answers: answers as IAnswer[]
            }, Operation.UPDATE)

        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "system Error: Error Happened While updating answers")
        }
    }
    // delete submission answers
    async deleteAnswers(submissionId: string, answerIds: IAnswer[]): Promise<ISubmissionDoc> {
        try {
            const submission = await this.findSubmission(submissionId)
            //check if the answerIds are valid
            const submissionAnswersIds = submission.answers.map((answer) => answer.id)
            const isValidAnswerIds = await checkIdsInSubDocs(Submission, submissionId, 'answers', submissionAnswersIds)
            if (isValidAnswerIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidAnswerIds.message)
            // delete answers
            return await this.submissionDAL.updateSubmission(submissionId, {
                answers: answerIds
            }, Operation.DELETE)

        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "system Error: Error Happened While deleting answers")
        }
    }
}
