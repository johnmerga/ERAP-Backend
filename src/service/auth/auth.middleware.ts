/* authentication middleware using jwt */
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import config from '../../config/config';
import { User } from '../../schema/user';
import { ApiError } from '../../errors';
import HttpStatus from 'http-status';


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')!.replace('Bearer ', '');
        const decoded = verify(token, config.jwt.secret);
        const user = await User.findOne({ _id: decoded.sub, 'tokens.token': token });
        if (!user) {
            throw new ApiError(HttpStatus.UNAUTHORIZED, 'Please authenticate.');
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(HttpStatus.UNAUTHORIZED, 'Please authenticate.'));
    }
}