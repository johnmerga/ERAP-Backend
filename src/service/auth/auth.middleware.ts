// authentication and authorization middleware using jwt
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import config from '../../config/config';
import { ApiError } from '../../errors';
import HttpStatus from 'http-status';
import { UserService } from '../user.service';
import { IPayload } from '../../model/token';
import { Role } from '../../model/user';

export const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.header('Authorization')!.replace('Bearer ', '');
        const decoded = verify(token, config.jwt.secret)
        if (!decoded || typeof decoded.sub !== 'string') {
            throw new ApiError(HttpStatus.BAD_REQUEST, 'bad user')
        }
        const userService = new UserService()
        const user = await userService.findUserById(decoded.sub)
        if (!user) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, 'Please authenticate.');
        }
        const userPermissionList = await userService.getUserPermissions(user.id)
        req.permissions = userPermissionList
        req.user = user;
        req.token = decoded as IPayload;
        next();
    } catch (error) {
        next(new ApiError(HttpStatus.UNAUTHORIZED, 'Please authenticate.'));
    }
}

export const authorizeMiddleware = (reqRoles: Role[], reqPermissions: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            if (!user || !req.permissions) {
                throw new ApiError(HttpStatus.UNAUTHORIZED, 'Please authenticate.');
            }
            console.log(req.user?.permissions)
            // const userPermissionList = await new PermissionService().getAllUserPermissions(user.id)
            const userRoles = user.roles as Role[]
            const isRoleMatched = userRoles.some(role => reqRoles.includes(role))
            const isPermissionMatched = reqPermissions.every((permission) => req.permissions?.includes(permission))
            if (!isRoleMatched || !isPermissionMatched) {
                throw new ApiError(HttpStatus.UNAUTHORIZED, 'You are not authorized to access this resource');
            }
            next();

        } catch (error) {
            next(error);
        }
    }

}