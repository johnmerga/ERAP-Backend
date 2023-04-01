import moment, { Moment } from "moment";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import { ApiError } from "../../errors";
import httpStatus from "http-status";

import { TokenService } from "./token.service"





export const generateToken = (
    userId: mongoose.Types.ObjectId | string,
    roles: string[],
    type: string,
    expires: Moment,
    secret: string = config.jwt.secret,
): string => {


    const payload = {
        sub: userId.toString(),
        roles,
        type,
        iat: moment().unix(),
        exp: expires.unix(),
    };
    return jwt.sign(payload, secret);
};
// example 
// const tokenPayload = {
//     userId: "6424a2f59b2822bef892d216",
//     roles: ['user'],
//     type: 'access',
//     expires: moment().add(config.jwt.accessExpirationMinutes, 'minutes'),
// }
// const token1 = generateToken(tokenPayload.userId, tokenPayload.roles, tokenPayload.type, tokenPayload.expires)
// console.log(token1)


export const verifyToken = (token: string, type: string): IPayload => {
    try {
        const payload = jwt.verify(token, config.jwt.secret);
        if (typeof payload.sub !== 'string') {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid token");
        }
        // change the value of type to TokenType
        // type = type.toLowerCase()
        return payload as IPayload
    } catch (error) {
        throw new Error('Invalid or expired token')
    }
};
// @ts-ignore
const findTokenFromDB = async (tokenQuery: TokenQuery): Promise<ITokenDoc> => {

    const tokenDoc = await new TokenService().findToken(tokenQuery);
    if (tokenQuery.type === 'refresh' && !tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
}

// test
// @ts-nocheck
// import * as db from '../../db/connect'
import { IPayload } from "../../model/token";

// db.connect()
// // @ts-ignore
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDI0YTJmNTliMjgyMmJlZjg5MmQyMWYiLCJyb2xlcyI6WyJ1c2VyIl0sInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE2ODAyMDYwOTksImV4cCI6MTY4MDIwNzg5OX0.gfYzrIsMxu8VFLqMzT7TZpRguraA-ZiH8Z-n2yHzvas';

// (() => {
//     const check = verifyToken(
//         token,
//         'access'
//     )
//     console.log(check.exp)
// })()