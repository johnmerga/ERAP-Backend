import { Request, Response } from "express"
import { catchAsync } from "../utils"
import { AuthService } from "../service/auth/auth.service"


export class AuthController {
    private authService: AuthService;
    constructor() {
        this.authService = new AuthService()
    }

    public login = catchAsync(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await this.authService.loginWithEmailAndPassword(email, password);
        res.send(user)
    })
}