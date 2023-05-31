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
        if (!req.user) throw new ApiError(httpStatus.UNAUTHORIZED, 'you can not create organization without registering as user first')
        const org = await this.orgService.create(req.body, req.user!);
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
    // update organization status
    public updateOrgStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.orgId === 'string') {
            const org = await this.orgService.updateOrgStatus(req.params.orgId, req.body.status);
            res.send(org);
        }
    })
    public updateOrgRating = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.orgId === 'string') {
            const org = await this.orgService.updateOrgRating(req.params.orgId, req.body, req.user!);
            res.send(org);
        }
    })
    public deleteOrg = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.orgId === 'string') {
            await this.orgService.deleteOrg(req.params.orgId);
            res.status(httpStatus.NO_CONTENT).send();
        }
    })
    public addCertificate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.orgId === 'string') {
            const org = await this.orgService.addCertificate(req.params.orgId, req.body.certificates);
            res.send(org);
        }
    })
    public updateCertificate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.orgId === 'string') {
            const org = await this.orgService.updateCertificate(req.params.orgId, req.body.certificates);
            res.send(org);
        }
    })

    public deleteCertificates = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.orgId === 'string') {
            const org = await this.orgService.deleteCertificates(req.params.orgId, req.body.certificates);
            res.send(org);
        }
    })

}