import { Permission, IPermission, IPermissionDoc } from "../model/permission"
import { ApiError } from "../errors"
import httpStatus from "http-status";

export class PermissionDal {

    async create(permission: IPermission): Promise<IPermissionDoc> {

        try {
            const newPermission = new Permission(permission)
            return await newPermission.save()

        } catch (error) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Error occured while creating permission");
        }
    }
    // find one permission
    async findPermission(query: Record<string, any>): Promise<IPermissionDoc> {
        try {
            const permission = await Permission.findOne(query)
            if (!permission) throw new ApiError(httpStatus.BAD_REQUEST, "Permission not found");
            return permission
        } catch (error) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Error occured while finding permission");
        }
    }
    // find all permissions
    async findPermissions(filter: Record<string, any>, project?: Record<any, any>): Promise<IPermissionDoc[]> {
        try {
            const foundPermissions = await Permission.find(filter, project ? project : {})
            if (!foundPermissions) throw new ApiError(httpStatus.BAD_REQUEST, "No permissions found")
            return foundPermissions
        } catch (error) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Error occured while finding permissions");
        }

    }

    // delete one permission

    async deletePermission(filter: Record<string, any>): Promise<IPermissionDoc> {
        try {
            const deletedPermission = await Permission.findOneAndDelete(filter)
            if (!deletedPermission) throw new ApiError(httpStatus.BAD_REQUEST, "Permission not found to delete")
            return deletedPermission
        } catch (error) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Error occured while deleting permission");
        }
    }



}



