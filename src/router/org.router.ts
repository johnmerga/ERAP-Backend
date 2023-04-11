import { OrgController } from "../controller";
import { Router } from 'express';
import { validate } from "../validator/custom"
import { orgValidator } from "../validator";

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
        this.router.route('/create').post(validate(orgValidator.createOrg), this.orgController.createOrg);
        // get organizations 
        this.router.route('/getAll').get(validate(orgValidator.getOrgs), this.orgController.getOrgs);
        // get organization by id
        this.router.route('/get/:orgId').get(validate(orgValidator.getOrg), this.orgController.getOrg);
        // update organization by id
        this.router.route('/update/:orgId').patch(validate(orgValidator.updateOrg), this.orgController.updateOrg);
        
        return this.router;
    }
}