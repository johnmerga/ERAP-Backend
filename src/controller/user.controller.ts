import { NextFunction, Request, Response } from 'express';
import { Logger } from '../logger';
import { UserService } from '../service/user';
import { newUserValidator } from "../validator/user"
import { ApiError } from '../errors';
import { catchAsync } from '../utils';
import httpStatus from 'http-status';

export class UserController {
    public static async getUser(req: Request, res: Response) {
        // check route
        res.status(200).send('User route');
    }
    /* create user */
    public static createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


        const { error, value } = newUserValidator.validate(req.body);
        if (error) {
            Logger.error('Error validating request body');
            throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message);

        }
        // create user
        const user = await new UserService().create(value);
        res.status(201).send(user);


    })
}