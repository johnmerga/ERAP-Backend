import Jwt from "jsonwebtoken"
import moment, { Moment } from "moment"
import httpStatus from "http-status"

import config from "../config/config"
import { INewPayload, TokenQuery } from "../model/token"
import { TokenDal } from "../dal"
import { AccessAndRefreshTokens, IPayload, ITokenDoc, TokenType } from "../model/token"
import { IUserDoc } from "../model/user"
import { ApiError } from "../errors"
import { UserService } from "."


export class TokenService {
    private tokenDal: TokenDal
    constructor() {
        this.tokenDal = new TokenDal()
    }

    /* generate token  */
    generateToken(payload: INewPayload, secret: string = config.jwt.secret): string {
        const tokenPayload: IPayload = {
            ...payload,
            exp: moment(payload.exp).unix(),
            iat: moment().unix(),
        }
        return Jwt.sign(tokenPayload, secret)
    }
    /* verify any token  */
    verifyAnyToke(token: string) {
        return Jwt.verify(token, config.jwt.secret)
    }
    /* save token to database */
    async saveToken(
        token: string,
        userId: string,
        expires: Moment,
        type: TokenType,
        blacklisted: boolean = false
    ): Promise<ITokenDoc> {
        const tokenDoc = await this.tokenDal.createToken({
            token,
            user: userId,
            expires: expires.toDate(),
            type,
        })
        return tokenDoc
    }

    /* verify token from database */
    async verifyToken(token: string, type: string): Promise<ITokenDoc> {
        try {

            const payload = Jwt.verify(token, config.jwt.secret)
            if (typeof payload.sub !== 'string') {
                throw new ApiError(httpStatus.BAD_REQUEST, 'bad user')
            }
            const tokenDoc = await this.tokenDal.findToken({ token, type, user: payload.sub })
            return tokenDoc
        } catch (error) {
            throw new Error('Error occured while verifying the token')
        }
    }

    /* generate access and refresh token */
    async generateAccessAndRefreshToken(user: IUserDoc): Promise<AccessAndRefreshTokens> {
        const accessPayload: INewPayload = {
            sub: user._id,
            roles: user.roles,
            type: TokenType.ACCESS,
            exp: moment().add(config.jwt.accessExpirationMinutes, "minutes")
        }
        const refreshPayload: INewPayload = {
            sub: user._id,
            roles: user.roles,
            type: TokenType.REFRESH,
            exp: moment().add(config.jwt.refreshExpirationDays, "days")
        }
        const accessToken = this.generateToken(accessPayload)
        const refreshToken = this.generateToken(refreshPayload)
        await this.saveToken(refreshToken, user._id, refreshPayload.exp, TokenType.REFRESH)
        return {
            access: {
                token: accessToken,
                expires: accessPayload.exp.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshPayload.exp.toDate(),
            }
        }
    }
    /* generate verify email email token */
    async generateVerifyEmailToken(user: IUserDoc): Promise<string> {
        const verifyEmailPayload: INewPayload = {
            sub: user._id,
            roles: user.roles,
            type: TokenType.VERIFY_EMAIL,
            exp: moment().add(config.jwt.verifyEmailExpirationMinutes, "minutes")
        }
        const verifyEmailToken = this.generateToken(verifyEmailPayload)
        await this.saveToken(verifyEmailToken, user.id, verifyEmailPayload.exp, TokenType.VERIFY_EMAIL)
        return verifyEmailToken
    }


    /* generate Reset Password Token */
    async generateResetPasswordToken(email: string): Promise<string> {
        const user = await new UserService().findUserByEmail(email)
        const resetPasswordPayload: INewPayload = {
            sub: user._id,
            roles: user.roles,
            type: TokenType.RESET_PASSWORD,
            exp: moment().add(config.jwt.resetPasswordExpirationMinutes, "minutes")
        }
        const resetPasswordToken = this.generateToken(resetPasswordPayload)
        await this.saveToken(resetPasswordToken, user._id, resetPasswordPayload.exp, TokenType.RESET_PASSWORD)
        return resetPasswordToken

    }

    /* find token  */
    async getToken(filter: TokenQuery): Promise<ITokenDoc> {
        const tokenDoc = await this.tokenDal.findToken(filter)
        return tokenDoc
    }

    /* delete token  */
    async deleteToken(filter: TokenQuery): Promise<ITokenDoc> {
        const tokenDoc = await this.tokenDal.deleteToken(filter)
        return tokenDoc
    }
    /* delete filtered token  */
    async deleteTokens(filter: TokenQuery) {
        await this.tokenDal.deleteTokens(filter)
        return
    }


}
