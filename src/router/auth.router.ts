import { Router } from "express"
import { Auth } from "../controller/auth.controller"

export class AuthRouter {
    public router: Router;
    constructor() {
        this.router = Router()

    }
    public routes() {
        this.router.route('/').get(Auth.loginUser)
        return this.router
    }

}