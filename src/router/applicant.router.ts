import { Router } from "express";
import { validate } from "../validator/custom"
import { applicantValidator } from "../validator";
import { ApplicantController } from "../controller/";

export class ApplicantRouter {
    public router: Router;
    private applicantController: ApplicantController;

    constructor() {
        this.applicantController = new ApplicantController();
        this.router = Router();
        this.routes();
    }

    public routes(): Router {
        // create applicant
        this.router.route('/').post(validate(applicantValidator.createApplicant), this.applicantController.createApplicant);
        // get applicant by id
        this.router.route('/:applicantId').get(validate(applicantValidator.getApplicant), this.applicantController.getApplicantById);
        // delete applicant by id
        this.router.route('/:applicantId').delete(validate(applicantValidator.deleteApplicant), this.applicantController.deleteApplicant);
        
        return this.router;
    }
}