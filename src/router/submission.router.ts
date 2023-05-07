import { Router } from "express";
import { SubmissionController } from "../controller/submission.controller";
import { submissionValidator } from "../validator";
import { validate } from "../validator/custom";

export class SubmissionRouter {
    private router: Router
    private submissionController: SubmissionController
    constructor() {
        this.router = Router()
        this.submissionController = new SubmissionController()
        this.routes()
    }
    public routes(): Router {
        // create submission
        this.router.route('/').post(validate(submissionValidator.createSubmission), this.submissionController.createSubmission)
        // get submissions
        this.router.route('/').get(validate(submissionValidator.getSubmissions), this.submissionController.querySubmissions)
        // get submission
        this.router.route('/:submissionId').get(validate(submissionValidator.getSubmission), this.submissionController.getSubmission)
        // update submission
        this.router.route('/:submissionId').patch(validate(submissionValidator.updateSubmission), this.submissionController.updateSubmission)
        // delete answers
        this.router.route('/:submissionId/answers').delete(validate(submissionValidator.deleteAnswers), this.submissionController.deleteAnswers)
        // give mark
        this.router.route('/:submissionId/mark').patch(validate(submissionValidator.evaluateSubmission), this.submissionController.giveMark)
        // delete submission
        this.router.route('/:submissionId').delete(validate(submissionValidator.deleteSubmission), this.submissionController.deleteSubmission)
        return this.router
    }
}