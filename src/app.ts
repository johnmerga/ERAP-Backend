import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { unless } from 'express-unless';
import { morganMiddleware } from './logger';
import { UserRouter, AuthRouter, OrgRouter, FormRouter, TenderRouter, ApplicantRouter, ChapaRouter } from './router';

import { ApiError, errorConverter, errorHandler } from "./errors"
import httpStatus from 'http-status';
import { SubmissionRouter } from './router/submission.router';
import { authenticateMiddleware } from './service/auth';

const auth = (authenticateMiddleware as any)
auth.unless = unless
const path = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/auth/verify-email',
    '/api/v1/auth/forgot-password',
    '/api/v1/auth/reset-password',
    '/api/v1/auth/refresh-token',
    '/api/v1/auth/logout',
    '/api/v1/test',
    { url: '/api/v1/orgs', methods: ['GET'] },
    { url: '/api/v1/tenders', methods: ['GET'] },
]
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
        // form routes
        this.app.use('/api/v1/forms', new FormRouter().routes());
        // tender routes
        this.app.use('/api/v1/tenders', new TenderRouter().routes());
        // applicant routes
        this.app.use('/api/v1/applicants', new ApplicantRouter().routes());
        // submission routes
        this.app.use('/api/v1/submissions', new SubmissionRouter().routes());
        // chapa payment routes
        this.app.use('/api/v1/payment/chapa', new ChapaRouter().routes());

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
        // require auth middleware for all routes except the ones in path
        this.app.use(auth.unless({ path: path }));
        // telling express server to trust whatever our nginx server is adding to header
        this.app.set('trust proxy', true);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(morganMiddleware);

    }


}

export default new App().app;
