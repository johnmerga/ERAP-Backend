import { OrgController } from "../controller";
import { Router } from 'express';
import { validate } from "../validator/custom"
import { certValidator, orgValidator } from "../validator";

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
        this.router.route('/').post(validate(orgValidator.createOrg), this.orgController.createOrg);
        // get organizations 
        this.router.route('/').get(validate(orgValidator.getOrgs), this.orgController.getOrgs);
        // get organization by id
        this.router.route('/:orgId').get(validate(orgValidator.getOrg), this.orgController.getOrg);
        // update organization by id
        this.router.route('/:orgId').patch(validate(orgValidator.updateOrg), this.orgController.updateOrg);
        // add certificate to organization by id
        this.router.route('/addCert/:orgId').patch(validate(certValidator.createCert), this.orgController.addCertificate);
        // remove certificate from organization by id
        this.router.route('/removeCert/:orgId/:certId').patch(validate(certValidator.deleteCert), this.orgController.removeCertificate);

        return this.router;
    }
}