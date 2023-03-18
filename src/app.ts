import express, { Express, NextFunction,Request,Response } from 'express';
import { morganMiddleware } from './logger';
import { UserRouter } from './router/user';

import { ApiError, errorConverter, errorHandler } from "./errors"
import httpStatus from 'http-status';
// import session from 'express-session'
// const MongoStore = require('connect-mongo')

// const mongoUrl = `${process.env.MONGO_URL}/${process.env.MONGO_DB_NAME}`;

// const sessionStore = new MongoStore({
//     mongooseConnection: mongoUrl,
//     collection: 'sessions'
// })

class App {
    public app: Express;
    //routes
    

    constructor() {
        this.app = express();
        this.config();
        // user routes
        this.app.use('/api/v1/users', new UserRouter().routes());

        // unknown route
        this.app.use((req:Request, res:Response, next:NextFunction) => {
            next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
        });
        // error converter
        this.app.use(errorConverter);
        // error handler
        this.app.use(errorHandler);
    }

    private config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(morganMiddleware);
        
    }


}

export default new App().app;


// this.app.use(session({
    //     secret: 'secret',
    //     resave: false,
    //     saveUninitialized: false,
    //     store: new MongoStore({
        //         mongoUrl: mongoUrl,
        //         collection: 'sessions'
        
        //     }),
        //     cookie: {
            //         maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            //     }
            
            // }))
            // error converter
            // private errorHandling() {
            //     this.app.use(errorConverter);
            //     this.app.use(errorHandler);
            // }