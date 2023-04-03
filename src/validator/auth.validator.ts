import Joi from "joi";
import { password } from "./custom";

export const login = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().custom(password).required(),
    }),

}