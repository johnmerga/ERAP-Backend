import joi from "joi";
import { capitalizeFirstLetter, password } from "./custom";
import { NewAdmin } from "../model/user";

export const registerBody: Record<keyof NewAdmin, any> = {
    name: joi.string().required().custom(capitalizeFirstLetter).trim(),
    email: joi.string().email().required().trim(),
    password: joi.string().required().trim(),
    phone: joi.string().required().trim(),
    address: joi.string().required().custom(capitalizeFirstLetter).trim(),
}

export const register = {
    body: joi.object().keys(registerBody),
}

export const login = {
    body: joi.object().keys({
        email: joi.string().email().required().trim(),
        password: joi.string().custom(password).required().trim(),
    }),

}

export const logout = {
    body: joi.object().keys({
        refreshToken: joi.string().required(),
    })
}

export const refreshTokens = {
    body: joi.object().keys({
        refreshToken: joi.string().required().trim(),
    }),
};

export const forgotPassword = {
    body: joi.object().keys({
        email: registerBody.email
    })
}

export const resetPassword = {
    query: joi.object().keys({
        token: joi.string().required(),
    }),
    body: joi.object().keys({
        password: registerBody.password,
    }),
};

export const verifyEmail = {
    query: joi.object().keys({
        token: joi.string().required().trim(),
    }),
};
