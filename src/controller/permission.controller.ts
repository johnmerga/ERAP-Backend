import { PermissionService } from "../service/";
import { Request, Response, NextFunction } from "express";
import { catchAsync, } from '../utils';
import httpStatus from 'http-status';

export class PermissionController {
    private permissionService: PermissionService;
    constructor() {
        this.permissionService = new PermissionService();
    }
    // get permission by role
    getPermissionByRole = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.permissionService.findPermissionByRole(req.body.role);
        res.status(httpStatus.OK).send(response);
    });
}