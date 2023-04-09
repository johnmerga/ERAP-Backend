import { ITokenDoc, NewToken, Token, TokenQuery } from "../model/token"

export class TokenDal {
    // create a new token
    async createToken(newToken: NewToken): Promise<ITokenDoc> {
        const token = await new Token(newToken).save()
        if (!token) throw new Error('error occured while saving the token to database')
        return token
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
