import { UserController } from "../controller";
import { Router } from 'express';

export class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): Router {
        this.router.route('/').get(UserController.getUser);
        this.router.route('/').post(UserController.createUser);

        return this.router;
    }
}