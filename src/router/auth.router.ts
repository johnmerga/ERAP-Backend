import { Router } from "express"
import { AuthController } from "../controller/auth.controller"
import { validate } from "../validator/custom"
import { authValidator } from "../validator"

export class AuthRouter {
    private authController: AuthController;
    public router: Router;
    constructor() {
        this.router = Router()
        this.authController = new AuthController()

    }
    public routes() {
        // login
        this.router.route('/login').post(validate(authValidator.login), this.authController.login)

        return this.router;
    }


}