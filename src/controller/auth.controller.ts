import httpStatus from "http-status";
import { Request, Response } from "express"
import { catchAsync } from "../utils"
import { AuthService } from "../service/auth"
import { UserService } from "../service";
import { TokenService } from "../service/token.service";
import { EmailService } from "../service/email";
import { Logger } from "../logger";
// import config from "../config/config";


export class AuthController {
    private authService: AuthService;
    private userService: UserService;
    private tokenService: TokenService;
    private emailService: EmailService;
    constructor() {
        this.authService = new AuthService()
        this.userService = new UserService()
        this.tokenService = new TokenService()
        this.emailService = new EmailService()
    }
    /*  */
    public register = catchAsync(async (req: Request, res: Response) => {
        const user = await this.userService.registerAdmin(req.body)
        Logger.info(`user: [${user.name}] with email : [${user.email}] created`)
        const tokens = await this.tokenService.generateAccessAndRefreshToken(user)
        res.status(httpStatus.CREATED).send({
            user,
            tokens
        })
    })
    /*  */
    public login = catchAsync(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await this.authService.loginWithEmailAndPassword(email, password);
        const tokens = await this.tokenService.generateAccessAndRefreshToken(user)
        res.status(httpStatus.OK).send({ user, tokens })
    })
    /*  */
    public logout = catchAsync(async (req: Request, res: Response) => {
        await this.authService.logout(req.body.refreshToken)
        res.status(httpStatus.NO_CONTENT).send()

    })
    /*  */
    public forgotPassword = catchAsync(async (req: Request, res: Response) => {
        const { email } = req.body
        const resetPasswordToken = await this.tokenService.generateResetPasswordToken(email);
        // send email
        await this.emailService.sendResetPasswordEmail(email, resetPasswordToken)
        res.status(httpStatus.NO_CONTENT).send()

    })
    /*  */
    public refreshToken = catchAsync(async (req: Request, res: Response) => {
        const userWithTokens = await this.authService.refreshAuth(req.body.refreshToken)
        res.send(userWithTokens)
    })

    /*  */
    public resetPassword = catchAsync(async (req: Request, res: Response) => {
        const { query } = req
        const token = query['token'] as unknown as string
        await this.authService.resetPassword(token, req.body.password)
        res.status(httpStatus.NO_CONTENT).send()
    })

    /* send verification  */
    public sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
        if (req.user) {
            if (req.user.isVerified) {
                res.status(httpStatus.BAD_REQUEST).send('User is already verified')
                return
            }
            const { email, name } = req.user
            const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(req.user);
            // send email
            await this.emailService.sendVerificationEmail(email, verifyEmailToken, name)
            // Log
            Logger.info(`Verification email sent to: [${email}]`)
            res.status(httpStatus.NO_CONTENT).send()
        }


    })
    /* verify email */
    public verifyEmail = catchAsync(async (req: Request, res: Response) => {
        const { query } = req
        await this.authService.verifyEmail((query['token'] as string))
        res.status(httpStatus.NO_CONTENT).send()
    })

}