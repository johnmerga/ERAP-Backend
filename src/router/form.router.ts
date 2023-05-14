import { Router } from "express";
import { FormController } from "../controller";
import { validate } from "../validator/custom";
import { formValidator } from "../validator";


export class FormRouter {
    public router: Router;
    private formController: FormController = new FormController();
    constructor() {
        this.router = Router();
        this.formController = new FormController();
    }
    public routes() {
        // create form
        this.router.route('/').post(validate(formValidator.createForm), this.formController.createForm);
        // get form by id
        this.router.route('/:formId').get(validate(formValidator.getForm), this.formController.getForm);
        // get all forms
        this.router.route('/').get(validate(formValidator.getForms), this.formController.queryForms);
        // update form by id
        this.router.route('/:formId').patch(validate(formValidator.updateForm), this.formController.updateForm);
        // delete form by id
        this.router.route('/:formId').delete(validate(formValidator.deleteForm), this.formController.deleteForm);
        return this.router;
    }
}