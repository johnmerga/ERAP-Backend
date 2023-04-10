import joi from "joi";
import { password } from "./custom";
import { NewAdmin } from "../model/user";

export const registerBody: Record<keyof NewAdmin, any> = {
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    phone: joi.string().required(),
    address: joi.string().required(),
}

export const register = {
    body: joi.object().keys(registerBody),
}

export const login = {
    body: joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().custom(password).required(),
    }),

}

export const logout = {
    body: joi.object().keys({
        refreshToken: joi.string().required(),
    })
}

export const refreshTokens = {
    body: joi.object().keys({
        refreshToken: joi.string().required(),
    }),
};

export const forgotPassword = {
    body: joi.object().keys({
        email: joi.string().required(),
    })
}

export const resetPassword = {
    query: joi.object().keys({
        token: joi.string().required(),
    }),
    body: joi.object().keys({
        password: joi.string().required().custom(password),
    }),
};

export const verifyEmail = {
    query: joi.object().keys({
        token: joi.string().required(),
    }),
};
