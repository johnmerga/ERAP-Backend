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
        // give mark
        this.router.route('/:submissionId/mark').patch(validate(submissionValidator.evaluateSubmission), this.submissionController.giveMark)
        // delete submission
        this.router.route('/:submissionId').delete(validate(submissionValidator.deleteSubmission), this.submissionController.deleteSubmission)

        // populate answers with question
        this.router.route('/:submissionId/answers').get(validate(submissionValidator.getSubmission), this.submissionController.getSubmissionWithQuestion)

        /**
         * ----------------------------------------------------------------------------------------------------
         * the following routes are only for answers
         * ----------------------------------------------------------------------------------------------------
         */
        // add submission answers
        this.router.route('/:submissionId/addAnswers').post(validate(submissionValidator.addAnswers), this.submissionController.addAnswers)
        // update submission answers
        this.router.route('/:submissionId/updateAnswers').patch(validate(submissionValidator.updateAnswers), this.submissionController.updateAnswers)
        // delete submission answers
        this.router.route('/:submissionId/deleteAnswers').delete(validate(submissionValidator.deleteAnswers), this.submissionController.deleteAnswers)


        return this.router
    }
}