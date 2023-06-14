// import { IUser, UserModel } from "../model/user"
import { User, IUserDoc, NewUser, NewAdmin, UpdateUserBody, Role } from "../model/user"
import { UserDal } from "../dal";
import httpStatus from "http-status";
import { ApiError } from "../errors";
import mongoose from "mongoose";
import { IOptions, QueryResult } from "../utils";
import { PermissionService } from "./permission.service";
import { NewAdminInput, NewUserValidation, UpdateAdminBody, UpdateUserBodyByAdmin, UpdateUserBodyForUser, VerifyUserAndOrgId } from "../model/user/user.model";


export class UserService {
    private userDal: UserDal;
    private permissionService: PermissionService;
    constructor() {
        this.userDal = new UserDal();
        this.permissionService = new PermissionService();
    }

    /* check email */
    public async isEmailTaken(email: string): Promise<boolean> {
        return User.isEmailTaken(email);
    }
    /*register admin  */
    public async registerAdmin(userBody: NewAdmin): Promise<IUserDoc> {
        // check if email is taken
        if (await this.isEmailTaken(userBody.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        const adminPermissions = await this.permissionService.getPermissionIdsByRole(Role.Admin)
        const userToBeCreated: NewAdminInput = {
            ...userBody,
            roles: [Role.Admin],
            permissions: [...adminPermissions],
        }

        return this.userDal.createAdmin(userToBeCreated);
    }
    /*  */
    public async registerSystemAdmin(userBody: NewAdmin): Promise<IUserDoc> {
        // check if email is taken
        if (await this.isEmailTaken(userBody.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        const sysAdminPermissions = await this.permissionService.getPermissionIdsByRole(Role.SysAdmin)
        const userToBeCreated: NewAdminInput = {
            ...userBody,
            roles: [Role.SysAdmin],
            permissions: [...sysAdminPermissions],
        }

        return this.userDal.createAdmin(userToBeCreated);
    }

    /* create user */
    public async createUser(userBody: NewUserValidation, owner: IUserDoc): Promise<IUserDoc> {
        if (!owner.orgId) throw new ApiError(httpStatus.BAD_REQUEST, 'Owner must have an orgId')
        // check if email is taken
        if (await this.isEmailTaken(userBody.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        const userPermissionList = []
        if (!userBody.roles.includes(Role.User)) {
            userBody.roles.push(Role.User)
        }
        for (const permission of userBody.roles) {
            const permissions = await this.permissionService.getPermissionIdsByRole(permission)
            userPermissionList.push(...permissions)
        }
        const userToBeCreated: NewUser = {
            ...userBody,
            orgId: owner.orgId,
            permissions: [...userPermissionList],

        }
        return this.userDal.createUser(userToBeCreated);
    }
    /* get user  */
    public async findUserById(id: string): Promise<IUserDoc> {
        const user = await User.findById(new mongoose.Types.ObjectId(id));
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        return user;
    }

    public async findUserByEmail(email: string): Promise<IUserDoc> {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
            }
            return user;
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'system error: error while finding user by email');
        }
    }
    /* Query for users */
    public async queryUsers(filter: Record<string, any>, options: IOptions, user: IUserDoc): Promise<QueryResult> {
        try {
            if (user.roles.includes(Role.SysAdmin)) {
                const queryResult = await User.paginate(filter, options);
                return queryResult;
            }
            else if (user.roles.includes(Role.Admin)) {
                if (!user.orgId) throw new ApiError(httpStatus.BAD_REQUEST, 'Owner must have an orgId')

                const filterWithOrgId = {
                    ...filter,
                    orgId: user.orgId
                }
                const queryResult = await User.paginate(filterWithOrgId, options);
                return queryResult;
            }
            else {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized: you must be an admin to query users')
            }
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'system error: error while querying users')
        }
    }

    /**
     * 
     * |-------------------------------------------updating users-------------------------------------------|
     */

    public async updateUserStatus(id: string, updateBody: VerifyUserAndOrgId): Promise<IUserDoc> {
        let user = await this.findUserById(id)
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        Object.assign(user, updateBody)
        user = await this.userDal.updateUser(new mongoose.Types.ObjectId(id), user)
        return user
    }
    // 
    public async updateUserById(id: string, updateBody: UpdateUserBody): Promise<IUserDoc> {
        let user = await this.findUserById(id)
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }

        if (updateBody.email && (await User.isEmailTaken(updateBody.email))) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        Object.assign(user, updateBody)
        user = await this.userDal.updateUser(new mongoose.Types.ObjectId(id), user)
        return user
    }
    // update Admin
    async updateAdminById(updateBody: UpdateAdminBody, admin: IUserDoc): Promise<IUserDoc> {
        // let user = await this.findUserById(id)
        // if (!user) {
        //     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        // }
        if (updateBody.email && (await User.isEmailTaken(updateBody.email))) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        if (updateBody.roles) {
            const userPermissionList = []
            for (const permission of updateBody.roles) {
                const permissions = await this.permissionService.getPermissionIdsByRole(permission)
                userPermissionList.push(...permissions)
            }
            updateBody.permissions = [...userPermissionList]
        }
        if (updateBody.permissions) {
            const userPermissionList = updateBody.permissions as unknown as string[]
            const permissions = await this.permissionService.getPermissionNamesByIds(userPermissionList)
            if (permissions.length !== userPermissionList.length) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid permission id found')
            }
            const convertedPermissions = permissions.map(({ id }) => new mongoose.Types.ObjectId(id))
            updateBody.permissions = [...convertedPermissions]
        }
        Object.assign(admin, updateBody)
        const UpdatedAdmin = await this.userDal.updateUser(admin._id, admin)
        return UpdatedAdmin
    }

    // update user by admin
    async updateUserRoleAndPermission(targetId: string, updateBody: UpdateUserBodyByAdmin, admin: IUserDoc): Promise<IUserDoc> {
        try {
            // check if the admin has the role of admin
            if (!admin.roles.includes(Role.Admin)) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized: you must be an admin to update user roles and permissions under your organization')
            // check if the target user is in the same org as the admin
            const targetUser = await this.findUserById(targetId)
            if (targetUser.orgId.toString() !== admin.orgId.toString()) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized: you can only update users in your organization')
            // check if the target user is an admin
            if (targetUser.roles.includes(Role.Admin) && targetUser.permissions.length > admin.permissions.length) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized: you can not update an admin with more permissions than you')
            // check if the target user is a sysAdmin
            if (targetUser.roles.includes(Role.SysAdmin)) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized: you can not update a sysAdmin')

            // if the updateBody has both roles and permissions, first based on the given role give automatically associated permissions, then adds the permissions if the permissions is different from the current permissions
            if (updateBody.roles && updateBody.permissions) {
                const userPermissionList = []
                // always give a user the user role 
                if (!updateBody.roles.includes(Role.User) || Object.keys(updateBody.roles).length === 0) {
                    updateBody.roles.push(Role.User)
                }
                const listOfAskedPermissions = updateBody.permissions as unknown as string[]
                const permissions = await this.permissionService.getPermissionNamesByIds(listOfAskedPermissions)
                if (permissions.length !== listOfAskedPermissions.length) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid permission id found')
                }
                const convertedPermissions = permissions.map(({ id }) => new mongoose.Types.ObjectId(id))
                updateBody.permissions = [...convertedPermissions]
                for (const permission of updateBody.roles) {
                    const permissions = await this.permissionService.getPermissionIdsByRole(permission)
                    userPermissionList.push(...permissions)
                }
                updateBody.permissions = [...userPermissionList, ...convertedPermissions]
                const userPermissionListSet = new Set(userPermissionList)
                const currentPermissionSet = new Set(targetUser.permissions)
                // checking any of the permissions is in sysAdmin permissions
                if (userPermissionListSet.size !== currentPermissionSet.size) {
                    updateBody.permissions = [...userPermissionListSet, ...convertedPermissions]
                }
                return await this.updateUserById(targetId, updateBody)
            }
            // if the updateBody has only roles, first based on the given role gives automatically associated permissions, then adds the permissions if the permissions is different from the current permissions
            else if (updateBody.roles) {
                const userPermissionList = []
                if (!updateBody.roles.includes(Role.User) || Object.keys(updateBody.roles).length === 0) {
                    updateBody.roles.push(Role.User)
                }
                for (const permission of updateBody.roles) {
                    const permissions = await this.permissionService.getPermissionIdsByRole(permission)
                    userPermissionList.push(...permissions)
                }

                updateBody.permissions = [...userPermissionList]
                const userPermissionListSet = new Set(userPermissionList)
                const currentPermissionSet = new Set(targetUser.permissions)
                if (userPermissionListSet.size !== currentPermissionSet.size) {
                    updateBody.permissions = [...userPermissionListSet]
                }
                return await this.updateUserById(targetId, updateBody)
            }
            // if the updateBody has only permissions, adds the permissions if the permissions is different from the current permissions
            else if (updateBody.permissions) {
                const listOfAskedPermissions = updateBody.permissions as unknown as string[]
                const permissions = await this.permissionService.getPermissionNamesByIds(listOfAskedPermissions)
                if (permissions.length !== listOfAskedPermissions.length) {
                    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid permission id found')
                }
                const convertedPermissions = permissions.map(({ id }) => new mongoose.Types.ObjectId(id))
                updateBody.permissions = [...convertedPermissions]
                const userPermissionListSet = new Set(convertedPermissions)
                const currentPermissionSet = new Set(targetUser.permissions)
                if (userPermissionListSet.size !== currentPermissionSet.size) {
                    updateBody.permissions = [...userPermissionListSet]
                }
                return await this.updateUserById(targetId, updateBody)
            }
            else {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Bad request: update body must have either roles or permissions or both')
            }

        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'system error: error while updating user role and permissions')
        }
    }
    // updating users with the role without sysAdmin and admin
    async updateUser(updateBody: UpdateUserBodyForUser, user: IUserDoc): Promise<IUserDoc> {

        try {
            if (updateBody.email && (await User.isEmailTaken(updateBody.email))) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
            }
            const userToBeUpdated: UpdateUserBodyForUser = {
                ...updateBody,
            }
            return await this.updateUserById(user.id, userToBeUpdated)
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'system error: error while updating user')
        }

    }


    /**
     * -------------------------------------------deleting users-------------------------------------------
     */

    /* delete user */
    public async deleteUserById(id: string, user: IUserDoc): Promise<IUserDoc> {
        if (id !== user.id) throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized: you can only delete your own profile')
        return await this.userDal.deleteUser(new mongoose.Types.ObjectId(id));
    }

    /* get user permissions as an array */
    public async getUserPermissions(id: string): Promise<string[]> {
        let user = await this.findUserById(id);
        user = await user.populate('permissions')
        const userPermissions = user.permissions.map((permission: Record<string, any>) => {
            return permission.name
        })
        return userPermissions
    }


}