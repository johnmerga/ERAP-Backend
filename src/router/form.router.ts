import { Router } from "express";
import { FormController } from "../controller";
import { validate } from "../validator/custom";
import { formValidator } from "../validator";


export class FormRouter {
    public router: Router;
    private formController: FormController;
    constructor() {
        this.router = Router();
        this.formController = new FormController();
    }
    public routes() {
        // create form
        this.router.route('/').post(validate(formValidator.createForm), this.formController.createForm);
        // get forms for bought tenders
        this.router.route('/boughtTenders').get(validate(formValidator.getForms), this.formController.getBoughtTenderForms);
        // get form by id
        this.router.route('/:formId').get(validate(formValidator.getForm), this.formController.getForm);
        // get all forms
        this.router.route('/').get(validate(formValidator.getForms), this.formController.queryForms);
        // update form by id: this end point every thing except form fields
        this.router.route('/:formId').patch(validate(formValidator.updateForm), this.formController.updateForm);
        // delete form by id
        this.router.route('/:formId').delete(validate(formValidator.deleteForm), this.formController.deleteForm);

        /**
         * ----------------------------------------------------------------------------------------------------
         * only form fields end points
         * ----------------------------------------------------------------------------------------------------
         */
        // add form fields to form by form id
        this.router.route('/:formId/addFields').post(validate(formValidator.addFormFields), this.formController.addFormFields);
        // update form fields by form id
        this.router.route('/:formId/updateFields').patch(validate(formValidator.updateFormFields), this.formController.updateFormFields);
        // delete form fields by form id
        this.router.route('/:formId/deleteFields').delete(validate(formValidator.deleteFormFields), this.formController.deleteFormFields);
        return this.router;
    }
}