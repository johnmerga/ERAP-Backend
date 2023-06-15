import { PaymentService } from "../service";
import { Request, Response, NextFunction } from "express";
import { catchAsync, pick } from '../utils';
import httpStatus from 'http-status';
import { ApiError } from "../errors";
import config from "../config/config";

export class PaymentController {
    private paymentService: PaymentService;
    constructor() {
        this.paymentService = new PaymentService();
    }
    //initiate payment
    paymentRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.paymentService.payWithChapa(req.body, req.user!);

        res.status(httpStatus.OK).send(response);
    });

    //verify 
    paymentVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { tx_ref } = req.params;
        const response = await this.paymentService.verifyChapaPayment(tx_ref);
        // redirect to the callback url
        if (response) {
            res.redirect(`${config.clientUrl}/Supplier/FormList`)
            return
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, 'payment verification failed');
        }
    })

    // get payments by orgId
    getPaymentByOrgId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?.orgId) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'User does not have an organization');
        }
        const filter = pick(req.query, ['paymentStatus', 'paymentType']);
        const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
        const response = await this.paymentService.getPaymentByOrgId(req.user!.orgId!.toString(), filter, options);
        res.status(httpStatus.OK).send(response);
    })
}

// 