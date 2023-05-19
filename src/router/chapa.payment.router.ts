import { Router } from "express"
import { validate } from "../validator/custom"
import { chapaPaymentValidator } from "../validator"
import { ChapaController } from "../controller";

export class ChapaRouter {
    private chapaController: ChapaController;
    public router: Router;
    constructor() {
        this.router = Router()
        this.chapaController = new ChapaController()
    }

    routes() {
        // payment initiation
        this.router.route('/initiation').post(validate(chapaPaymentValidator.createChapaPayment), this.chapaController.paymentRequest)
        // payment verify
        this.router.route('/:tx_ref').get(validate(chapaPaymentValidator.verifyChapaPayment), this.chapaController.paymentVerify)
        return this.router;
    }
}