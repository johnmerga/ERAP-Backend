import { Router } from "express"
import { AuthController } from "../controller"
import { authenticateMiddleware } from "../service/auth"
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
        // register
        this.router.route('/register').post(validate(authValidator.register), this.authController.register)
        // login
        this.router.route('/login').post(validate(authValidator.login), this.authController.login)
        //logout
        this.router.route('/logout').post(validate(authValidator.logout), this.authController.logout)
        // send verification email
        this.router.route('/send-verification-email').post(authenticateMiddleware, this.authController.sendVerificationEmail)
        //verify email
        this.router.route('/verify-email').get(validate(authValidator.verifyEmail), this.authController.verifyEmail)
        // refresh token
        this.router.route('/refresh-token').post(validate(authValidator.refreshTokens), this.authController.refreshToken)
        // forgot password
        this.router.route('/forgot-password').post(validate(authValidator.forgotPassword), this.authController.forgotPassword)
        // reset password
        this.router.route('/reset-password').post(validate(authValidator.resetPassword), this.authController.resetPassword)

        return this.router;
    }


}