import { PermissionListGetter } from "../model/permission/permission.model";
import Joi from "joi";
import { Role } from "../model/user";

const createPermissionBody: Record<keyof PermissionListGetter, any> = {
    role: Joi.string().valid(...Object.values(Role), 'all').insensitive().trim(),
}

export const getPermissionByRole = {
    body: Joi.object().keys(createPermissionBody).options({ presence: 'required', abortEarly: false }),
}