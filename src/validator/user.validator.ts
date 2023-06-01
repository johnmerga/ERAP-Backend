import joi from 'joi';
import { Role } from '../model/user';
import Joi from 'joi';
import { capitalizeFirstLetter, objectId, password } from './custom';
import { NewUserValidation, UpdateAdminBody, UpdateUserBodyByAdmin, UpdateUserBodyForUser } from '../model/user/user.model';

const MongoId = joi.string().custom(objectId)
// new user validator

const createUserBody: Record<keyof NewUserValidation, any> = {
    name: joi.string().custom(capitalizeFirstLetter).trim(),
    email: joi.string().email().lowercase().trim(),
    password: joi.string().custom(password).trim(),
    address: joi.string().custom(capitalizeFirstLetter).trim(),
    phone: joi.string().trim(),
    roles: joi.array().items(joi.string().valid(...Object.values(Role)).insensitive().trim()),
}

export const createUser = {
    body: joi.object().keys(createUserBody).options({ presence: "required" }),
}

export const getUsers = {
    query: Joi.object().keys({
        name: createUserBody.name,
        roles: Joi.string().valid(...Object.values(Role)).insensitive().trim(),
        orgId: MongoId,
        sortBy: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
        populate: Joi.string(),
    })
}
/**
 * -------------------------------------------Update user------------------------------------------------------
 */
const { roles, ...otherUserUpdateFields } = createUserBody
const updateUserBody: Record<keyof UpdateUserBodyForUser, any> = {
    ...otherUserUpdateFields,
}
const updateAdminBody: Record<keyof UpdateAdminBody, any> = {
    ...createUserBody,
    roles: Joi.array().items(Joi.string().valid(...Object.values(Role).filter(v => v !== Role.SysAdmin)).insensitive().trim()),
    permissions: Joi.array().items(MongoId),
}
const updateUserRoleAndPermissionBody: Record<keyof UpdateUserBodyByAdmin, any> = {
    permissions: Joi.array().items(MongoId),
    roles: Joi.array().items(Joi.string().valid(...Object.values(Role).filter(v => v !== Role.SysAdmin)).insensitive().trim()),
}



// update user validator
export const updateAdmin = {
    body: Joi.object()
        .keys(updateAdminBody)

}
// update user validator
export const updateUser = {
    body: Joi.object()
        .keys(updateUserBody)
        .min(1),
};
// update users role and permission validator only done by admin
export const updateUserRoleAndPermission = {
    params: Joi.object().keys({
        userId: MongoId.required(),
    }),
    body: Joi.object()
        .keys(updateUserRoleAndPermissionBody)
        .min(1),
}

/**
 * ---------------------^^^^----------------------Update user------------^^^^^^^^-------------------------------
*/
export const getUser = {
    params: Joi.object().keys({
        userId: MongoId.required(),
    }),
    // query: Joi.object().keys({
    //     projectBy: Joi.string(),
    //     populate: Joi.string().valid('permissions.name', 'permissions.description', 'permissions.name,permissions.description', 'permissions.description,permissions.name')
    // })
};


export const deleteUser = {
    params: Joi.object().keys({
        userId: MongoId.required(),
    }),
};
