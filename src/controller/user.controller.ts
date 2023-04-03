import { NextFunction, Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { ApiError } from '../errors';
import { catchAsync, pick } from '../utils';
import httpStatus from 'http-status';

export class UserController {

    private userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    public createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await this.userService.create(req.body);
        res.status(httpStatus.CREATED).send(user);
    });

    public getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.userId === 'string') {
            const user = await this.userService.findUserById(req.params.userId);
            if (!user) {
                throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
            }
            res.send(user);
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user id');
        }
    });

    public getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const filter = pick(req.query, ['name', 'email', 'roles', 'orgId']);
        const options = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
        const result = await this.userService.queryUsers(filter, options);
        res.send(result);
    });

    public updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (typeof req.params.userId === 'string') {
            const user = await this.userService.updateUserById(req.params.userId, req.body);
            res.send(user);
        }
    });

    public deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await this.userService.findUserById(req.params.userId);
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        await this.userService.deleteUserById(req.params.userId);
        res.status(httpStatus.NO_CONTENT).send();
    });

}