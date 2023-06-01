import httpStatus from "http-status";
import { PermissionDal } from "../dal";
import { ApiError } from "../errors";
import { IPermission, IPermissionDoc, permissionList } from "../model/permission"
import { Role } from "../model/user";
import mongoose from "mongoose";
import { PermissionListBasicInfo } from "../model/permission/permission.model";



export class PermissionService {
    private permissionDal: PermissionDal;

    constructor() {
        this.permissionDal = new PermissionDal();
    }

    async createPermission(permission: IPermission): Promise<IPermissionDoc> {
        const newPermission = await this.permissionDal.create(permission)
        return newPermission
    }
    async findPermission(filter: Record<string, any>): Promise<IPermissionDoc> {
        const foundPermission = await this.permissionDal.findPermission(filter)
        return foundPermission
    }
    async findPermissions(filter: Record<string, any>): Promise<IPermissionDoc[]> {
        const foundPermissions = await this.permissionDal.findPermissions(filter)
        return foundPermissions
    }
    async findPermissionByRole(role: Role | 'all'): Promise<IPermissionDoc[] | Record<Role, IPermission[]>> {
        try {
            if (role === 'all') {
                const response: Record<Role, IPermission[]> = {
                    admin: [],
                    compliance: [],
                    evaluator: [],
                    procurement: [],
                    sysAdmin: [],
                    user: []
                }

                for (const role of Object.values(Role)) {
                    const searchConditions = permissionList[`${role}Permissions`].map(({ name }) => ({ name }))
                    const foundPermissions = (await this.permissionDal.findPermissions({ $or: searchConditions }))
                    const parsedPermissions = JSON.parse(JSON.stringify(foundPermissions))
                    response[role] = parsedPermissions

                }
                return response
            }
            let rolePermissions: IPermission[] = []
            switch (role) {
                case Role.SysAdmin:
                    rolePermissions = permissionList.sysAdminPermissions
                    break;
                case Role.Admin:
                    rolePermissions = permissionList.adminPermissions
                    break;
                case Role.Procurement:
                    rolePermissions = permissionList.procurementPermissions
                    break;
                case Role.Evaluator:
                    rolePermissions = permissionList.evaluatorPermissions
                    break;
                case Role.Compliance:
                    rolePermissions = permissionList.compliancePermissions
                    break;
                case Role.User:
                    rolePermissions = permissionList.userPermissions
                    break;
                default:
                    break;
            }
            const searchConditions = rolePermissions.map(({ name }) => ({ name }))
            const foundPermissions = await this.permissionDal.findPermissions({ $or: searchConditions })
            return foundPermissions
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.BAD_REQUEST, "Error occured while finding permissions")
        }
    }
    async getPermissionIdsByRole(role: Role): Promise<mongoose.Types.ObjectId[]> {
        try {
            const permissions = permissionList[`${role}Permissions`]
            const searchConditions = permissions.map(({ name }) => ({ name }))
            const foundPermissions = await this.permissionDal.findPermissions({ $or: searchConditions }, { _id: 1 })
            return foundPermissions.map(({ _id }) => _id)
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.BAD_REQUEST, "Error occured while finding permissions")
        }
    }
    // takes an array of permission ids and return an array of permission names, but first check if the permission ids are valid
    async getPermissionNamesByIds(permissionIds: string[]): Promise<PermissionListBasicInfo[]> {
        try {
            const permissionObjectIds = permissionIds.map(id => new mongoose.Types.ObjectId(id))
            const foundPermissions = await this.permissionDal.findPermissions({ _id: { $in: permissionObjectIds } }, { name: 1, description: 1, _id: 1 })
            return foundPermissions.map(({ name, _id, description }) => ({
                                                                            id: _id,
                                                                            name,
                                                                            description
                                                                        }))
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.BAD_REQUEST, "Error occured while finding permissions")
        }
    }
    async deletePermission(filter: Record<string, any>): Promise<IPermissionDoc> {
        const deletedPermission = await this.permissionDal.deletePermission(filter)
        return deletedPermission
    }
}
