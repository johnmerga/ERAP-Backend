
import { ITokenDoc, Token, TokenQuery } from "../model/token"
import { ApiError } from "../errors";
import httpStatus from "http-status";



export class TokenDal {
    // create a new token
    async createToken(newToken: Object): Promise<ITokenDoc> {
        const token = new Token(newToken).save()
            .then(function (token: ITokenDoc) {
                return token
            })
            // @ts-ignore
            .catch(function (err: any) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, err);

            })

        return token;

    }

    // find a token
    async findToken(query: TokenQuery): Promise<ITokenDoc> {
        const foundToken = Token.findOne(query)
            .then(function (token) {
                return token as ITokenDoc
            }
            )
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "Token not found");

            }
            )

        return foundToken;

    }

    // update a token
    // async updateToken(query: TokenQuery, update: IToken): Promise<ITokenDoc | null> {}

}

