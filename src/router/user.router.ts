import { UserController } from "../controller";
import { Router } from 'express';
import { validate } from "../validator/custom"
import { userValidator } from "../validator";

export class UserRouter {
    public router: Router;
    private userController: UserController;

    constructor() {
        this.userController = new UserController();
        this.router = Router();
        this.routes();
    }

    public routes(): Router {
        // create user
        this.router.route('/').post(validate(userValidator.createUser), this.userController.createUser);
        // get users 
        this.router.route('/').get(validate(userValidator.getUsers), this.userController.getUsers);
        // get user by id
        this.router.route('/:userId').get(validate(userValidator.getUser), this.userController.getUser);
        // update user by id
        this.router.route('/:userId').patch(validate(userValidator.updateUser), this.userController.updateUser);
        // delete user by id
        this.router.route('/:userId').delete(validate(userValidator.deleteUser), this.userController.deleteUser);

        return this.router;
    }
}