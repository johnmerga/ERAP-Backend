import { PaymentService } from "../service";
import { Request, Response, NextFunction } from "express";
import { catchAsync, pick } from '../utils';
import httpStatus from 'http-status';
import { ApiError } from "../errors";

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
        const response = await this.paymentService.verifyChapaPayment(req.params.tx_ref);
        res.status(httpStatus.OK).send(response);
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