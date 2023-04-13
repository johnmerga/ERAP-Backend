import { NextFunction, Request, Response } from 'express';
import { OrgService } from '../service/org.service';
import { ApiError } from '../errors';
import { catchAsync, pick } from '../utils';
import httpStatus from 'http-status';

export class OrgController {

    private orgService: OrgService;
    constructor() {
        this.orgService = new OrgService();
    }

    public createOrg = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const org = await this.orgService.create(req.body);
        res.status(httpStatus.CREATED).send(org);
    });

    public getOrg = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.orgId === 'string') {
            const org = await this.orgService.findOrgById(req.params.orgId);
            if (!org) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
            }
            res.send(org);
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid org id');
        }
    });

    public getOrgs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const filter = pick(req.query, ['name', 'type', 'capital', 'sector', 'rating']);
        const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
        const result = await this.orgService.queryOrgs(filter, options);
        res.send(result);
    });

    public updateOrg = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.orgId === 'string') {
            const org = await this.orgService.updateOrgProfile(req.params.orgId, req.body);
            res.send(org);
        }
    });

    public addCertificate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.orgId === 'string') {
            const org = await this.orgService.addCertificate(req.params.orgId, req.body);
            res.send(org);
        }
    })

    public removeCertificate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.orgId === 'string' && typeof req.params.certId === 'string') {
            const org = await this.orgService.removeCertificate(req.params.orgId, req.params.certId);
            res.send(org);
        }
    })

}