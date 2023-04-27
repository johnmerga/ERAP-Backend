import httpStatus from "http-status"
import { ITokenDoc, NewToken, Token, TokenQuery } from "../model/token"
import { ApiError } from "../errors"

export class TokenDal {
    // create a new token
    async createToken(newToken: NewToken): Promise<ITokenDoc> {
        try {
            const token = await new Token(newToken).save()
            if (!token) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'error occured while creating token')
            }
            return token
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError(httpStatus.BAD_REQUEST, 'system error occured while creating token')
        }
    }

    // find a token
    async findToken(filter: TokenQuery): Promise<ITokenDoc> {
        const token = await Token.findOne(filter)
        if (!token) throw new Error('Token not found')
        return token
    }

    // delete a token
    async deleteToken(filter: TokenQuery): Promise<ITokenDoc> {
        const token = await Token.findOneAndDelete(filter)
        if (!token) throw new Error("there's no token to delete")
        return token
    }
    async deleteTokens(filter: TokenQuery) {
        const token = await Token.deleteMany(filter)
        if (!token) throw new Error("there's no token to delete")
        return
    }

}
