import { Router } from "express";
import { validate } from "../validator/custom"
import { tenderValidator } from "../validator";
import { TenderController } from "../controller/";

export class TenderRouter {
    public router: Router;
    private tenderController: TenderController;

    constructor() {
        this.tenderController = new TenderController();
        this.router = Router();
        this.routes();
    }

    public routes(): Router {
        // create tender
        this.router.route('/').post(validate(tenderValidator.createTender), this.tenderController.createTender);
        // invite tender
        this.router.route('/:tenderId/invite').post(validate(tenderValidator.inviteTender), this.tenderController.inviteTender);
        // get tenders 
        this.router.route('/').get(validate(tenderValidator.getTenders), this.tenderController.getTenders);
        // get my invitations
        this.router.route('/invitations').get(validate(tenderValidator.getTenders), this.tenderController.getInvitedTenders);
        // get published tenders
        this.router.route('/published').get(validate(tenderValidator.getPublishedTenders), this.tenderController.getPublishedTenders);
        // get my tenders
        this.router.route('/my-tenders').get(validate(tenderValidator.getMyTenders), this.tenderController.getMyTenders);
        // get tender by id
        this.router.route('/:tenderId').get(validate(tenderValidator.getTender), this.tenderController.getTenderById);
        // get tender applicants
        this.router.route('/:tenderId/applicants').get(validate(tenderValidator.getTender), this.tenderController.getTenderApplicants);
        // update tender by id
        this.router.route('/:tenderId').patch(validate(tenderValidator.updateTender), this.tenderController.updateTender);
        // delete tender by id
        this.router.route('/:tenderId').delete(validate(tenderValidator.deleteTender), this.tenderController.deleteTender);

        return this.router;
    }
}