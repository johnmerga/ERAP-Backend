// authentication and authorization middleware using jwt
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import config from '../../config/config';
import { ApiError } from '../../errors';
import HttpStatus from 'http-status';
import { UserService } from '../user.service';
import { PermissionService } from '../permission.service';


export const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.header('Authorization')!.replace('Bearer ', '');
        const decoded = verify(token, config.jwt.secret);
        if (typeof decoded.sub !== 'string') {
            throw new ApiError(HttpStatus.BAD_REQUEST, 'bad user')
        }
        const user = await new UserService().findUserById(decoded.sub)
        if (!user) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, 'Please authenticate.');
        }
        const userPermissionList = await new PermissionService().getAllUserPermissions(user.id)
        req.permissions = userPermissionList
        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(HttpStatus.UNAUTHORIZED, 'Please authenticate.'));
    }
}

export const authorizeMiddleware = (reqRoles: string[], reqPermissions: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            if (!user || !req.permissions) {
                throw new ApiError(HttpStatus.UNAUTHORIZED, 'Please authenticate.');
            }
            console.log(req.user?.permissions)
            // const userPermissionList = await new PermissionService().getAllUserPermissions(user.id)
            const isRoleMatched = user.roles.every((role) => reqRoles.includes(role))
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