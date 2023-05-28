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
        this.router.route('/').post(validate(orgValidator.createOrg), this.orgController.createOrg);
        // get organizations 
        this.router.route('/').get(validate(orgValidator.getOrgs), this.orgController.getOrgs);
        // get organization by id
        this.router.route('/:orgId').get(validate(orgValidator.getOrg), this.orgController.getOrg);
        // update organization by id: only rating
        this.router.route('/:orgId/updateRating').patch(validate(orgValidator.updateOrgRating), this.orgController.updateOrgRating);
        // update organization by id: only status, this route is only for system admin
        this.router.route('/:orgId/updateStatus').patch(validate(orgValidator.updateOrgStatus), this.orgController.updateOrgStatus);
        /**
         * ----------------------------------------------------------------------------------------------------
         * update organization by id: this end point is used to update organization profile except certificates
         * ----------------------------------------------------------------------------------------------------
         */
        this.router.route('/:orgId').patch(validate(orgValidator.updateOrg), this.orgController.updateOrg);
        // delete organization by id
        this.router.route('/:orgId').delete(validate(orgValidator.deleteOrg), this.orgController.deleteOrg);

        /**
         * ----------------------------------------------------------------------------------------------------
         * only certificates end points
         * ----------------------------------------------------------------------------------------------------
         */
        // add certificate to organization by org id
        this.router.route('/:orgId/addCert').post(validate(orgValidator.addCertificates), this.orgController.addCertificate);
        // update certificate to organization by org id
        this.router.route('/:orgId/updateCert').patch(validate(orgValidator.updateCertificates), this.orgController.updateCertificate);
        // delete certificate from organization by id
        this.router.route('/:orgId/deleteCerts').delete(validate(orgValidator.deleteCert), this.orgController.deleteCertificates);

        return this.router;
    }
}