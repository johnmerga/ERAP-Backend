import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ApiError } from './api.error';
import { Logger } from '../logger';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';


export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;
    if (!(err instanceof ApiError)) {
        const statusCode: number = error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message: string = err.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};


export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[statusCode] as string;
    }
    res.locals.errorMessage = err.message;
    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };
    if (config.env == 'development') {
        Logger.error(err);
    }
    res.status(statusCode).send(
        {
            error: response
        }
    );

}