import { chapaService } from "../service";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from '../utils';
import httpStatus from 'http-status';

export class ChapaController {
    private chapaService: chapaService;

    constructor() {
        this.chapaService = new chapaService();
    }
    //initiate payment
    paymentRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.chapaService.paymentInitiation(req.body);
        res.status(httpStatus.OK).send(response);
    });

    //verify 
    paymentVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.chapaService.paymentVerification(req.params.tx_ref);
        res.status(httpStatus.OK).send(response);
    })
}