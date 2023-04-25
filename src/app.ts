import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { morganMiddleware } from './logger';
import { UserRouter, AuthRouter, OrgRouter } from './router';

import { ApiError, errorConverter, errorHandler } from "./errors"
import httpStatus from 'http-status';

class App {
    public app: Express;
    //routes


    constructor() {
        this.app = express();
        this.config();
        //auth routes
        this.app.use('/api/v1/auth', new AuthRouter().routes());
        // user routes
        this.app.use('/api/v1/users', new UserRouter().routes());
        // org routes
        this.app.use('/api/v1/orgs', new OrgRouter().routes());
        // tender routes
        this.app.use('/api/v1/tenders', new TenderRouter().routes());

        // unknown route
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            next(new ApiError(httpStatus.NOT_FOUND, 'unknown route'));
        });
        // error converter
        this.app.use(errorConverter);
        // error handler
        this.app.use(errorHandler);
    }

    private config() {
        // set security HTTP headers
        this.app.use(helmet());
        // enable cors
        this.app.use(cors());
        this.app.use('*', cors())
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(morganMiddleware);

    }


}

export default new App().app;
