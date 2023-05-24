import { Router } from "express"
import { validate } from "../validator/custom"
import { paymentValidator } from "../validator"
import { PaymentController } from "../controller";

export class PaymentRouter {
    private paymentController: PaymentController;
    public router: Router;
    constructor() {
        this.router = Router()
        this.paymentController = new PaymentController()
    }

    routes() {
        // payment initiation
        this.router.route('/initiation').post(validate(paymentValidator.createPayment), this.paymentController.paymentRequest)
        // payment verify
        this.router.route('/verify/:tx_ref').get(validate(paymentValidator.verifyPayment), this.paymentController.paymentVerify)
        // get payments by orgId
        this.router.route('/org').get(validate(paymentValidator.getPaymentByOrgId), this.paymentController.getPaymentByOrgId)

        return this.router;
    }
}