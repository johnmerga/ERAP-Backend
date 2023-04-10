import { OrgController } from "../controller";
import { Router } from 'express';
import { validate } from "../validator/custom"
import { orgValidator } from "../validator";
import { authenticateMiddleware, authorizeMiddleware } from "../service/auth";

export class OrgRouter {
    public router: Router;
    private orgController: OrgController;

    constructor() {
        this.orgController = new OrgController();
        this.router = Router();
        this.routes();
    }

    public routes(): Router {
        // create organization
        this.router.route('/createOrg').post(validate(orgValidator.createOrg), this.orgController.createOrg);
        // get organizations 
        this.router.route('/getOrgs').get(validate(orgValidator.getOrgs), this.orgController.getOrgs);
        // get organization by id
        this.router.route('/getOrg/:orgId').get(validate(orgValidator.getOrg), this.orgController.getOrg);
        // update organization by id
        this.router.route('/updateOrg/:orgId').patch(validate(orgValidator.updateOrg), this.orgController.updateOrg);
        
        return this.router;
    }
}