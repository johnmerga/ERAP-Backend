import { UserService } from "../user.service"
import { IUserDoc, IUserWithTokens, USER_STATUS } from "../../model/user";
import { TokenService } from "../token.service";
import { TokenType } from "../../model/token";
import { ApiError } from "../../errors";
import httpStatus from "http-status";
import {  VerifyUserAndOrgId } from "../../model/user/user.model";


export class AuthService {
    private userService: UserService;
    private tokenService: TokenService;
    constructor() {
        this.userService = new UserService()
        this.tokenService = new TokenService()
    }
    /* Login with email and password */
    public async loginWithEmailAndPassword(email: string, password: string): Promise<IUserDoc> {
        const user = await this.userService.findUserByEmail(email);
        if (!(await user.isPasswordMatch(password))) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
        }
        // check if user is verified and it's status is active
        if (!user.isVerified || !(user.status === USER_STATUS.ACTIVE)) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Your account is not verified or is not active')
        }
        return user;
    }

    /* Logout */
    public async logout(refreshToken: string): Promise<void> {
        const token = await this.tokenService.getToken({
            token: refreshToken,
            type: TokenType.REFRESH,
        });
        await this.tokenService.deleteToken({
            token: token.token,
            type: TokenType.REFRESH,
            user: token.user
        });
    }

    /* refresh auth token */
    public async refreshAuth(token: string): Promise<IUserWithTokens> {
        const tokenDoc = await this.tokenService.verifyToken(token, TokenType.REFRESH)
        const user = await this.userService.findUserById(tokenDoc.user)
        await this.tokenService.deleteTokens({
            token,
            type: TokenType.REFRESH,
            user: user.id
        });
        const newAuthToken = await this.tokenService.generateAccessAndRefreshToken(user)
        return {
            user,
            tokens: newAuthToken
        }

    }
    /* reset password*/
    public async resetPassword(token: string, password: string): Promise<void> {
        const tokenDoc = await this.tokenService.verifyToken(token, TokenType.RESET_PASSWORD)
        const user = await this.userService.findUserById(tokenDoc.user)
        await this.tokenService.deleteTokens({
            token,
            type: TokenType.RESET_PASSWORD,
            user: user.id
        });
        await this.userService.updateUserById(user.id, { password })
    }

    /* verify email */
    public async verifyEmail(token: string): Promise<IUserDoc> {
        const tokenDoc = await this.tokenService.verifyToken(token, TokenType.VERIFY_EMAIL)
        const user = await this.userService.findUserById(tokenDoc.user)
        await this.tokenService.deleteTokens({
            token,
            type: TokenType.VERIFY_EMAIL,
            user: user.id
        })
        const updateStatus: VerifyUserAndOrgId = {
            isVerified: true,
            status: USER_STATUS.ACTIVE
        }
        const updateUser = await this.userService.updateUserStatus(user.id, updateStatus)
        return updateUser
    }


}