import { JwtPayload } from "jsonwebtoken";
import { Model, Document } from "mongoose"


export interface IToken  {
    token: string;
    user: string;
    type: string;
    expires: Date;
    blacklisted: boolean;

}
export type NewToken = Omit<IToken, "blacklisted">;

export interface ITokenDoc extends IToken, Document { }
export interface ITokenModel extends Model<ITokenDoc> { }

export interface IPayload extends JwtPayload {
    sub: string;
    roles: [string];
    iat: number;
    exp: number;
    type: string;
}

export interface TokenPayload {
    token: string;
    expires: Date;
}

export interface AccessAndRefreshTokens {
    access: TokenPayload;
    refresh: TokenPayload;
}

export type TokenQuery = {
    token: string;
    type: string;
    user: string;
    blacklisted?: boolean;
}