import httpStatus from "http-status";
import { ApiError } from "../../errors";
import { UserService } from "../user.service"
import { IUserDoc } from "../../model/user";


export class AuthService {
    private userService: UserService;
    constructor() {
        this.userService = new UserService()
    }
    /* Login with email and password */
    public async loginWithEmailAndPassword(email: string, password: string): Promise<IUserDoc> {
        const user = await this.userService.findUserByEmail(email);
        if (!user || !(await user.isPasswordMatch(password))) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
        }
        return user;
    }


}