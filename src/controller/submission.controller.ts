import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils";
import httpStatus from "http-status";
import { SubmissionService } from "../service/submission.service";

export class SubmissionController {
    private submissionService: SubmissionService
    constructor() {
        this.submissionService = new SubmissionService()
    }
    createSubmission = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const submission = await this.submissionService.create(req.body)
        res.status(httpStatus.CREATED).send(submission)
    }
    )
    getSubmission = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const submission = await this.submissionService.findSubmission(req.params.submissionId)
        res.status(httpStatus.OK).send(submission)
    }
    )
    querySubmissions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const filter = req.query
        const options = req.query
        const result = await this.submissionService.querySubmissions(filter, options)
        res.status(httpStatus.OK).send(result)
    }
    )

    updateSubmission = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const submission = await this.submissionService.updateSubmission(req.params.submissionId, req.body)
        res.status(httpStatus.OK).send(submission)
    }
    )
    // give mark
    giveMark = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const submission = await this.submissionService.giveMark(req.params.submissionId, req.body.marks)
        res.status(httpStatus.OK).send(submission)
    })
    // delete answers 
    deleteAnswers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await this.submissionService.deleteAnswers(req.params.submissionId, req.body.answerIds)
        res.status(httpStatus.OK).send()
    })
    deleteSubmission = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await this.submissionService.deleteSubmission(req.params.submissionId)
        res.status(httpStatus.OK).send()
    }
    )


}