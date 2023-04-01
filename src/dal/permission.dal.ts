import { Permission, IPermission, IPermissionDoc } from "../model/permission"
import { ApiError } from "../errors"
import httpStatus from "http-status";

export class PermissionDal {

    async create(permission: IPermission): Promise<IPermissionDoc> {

        const newPermission = new Permission(permission).save()
            .then(function (permission) {
                return permission
            })
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, err);

            })

        return newPermission;

    }
    // find one permission
    async findPermission(query: Record<string, any>): Promise<IPermissionDoc> {
        const permission = Permission.findOne(query)
            .then(function (permission) {

                return permission as IPermissionDoc
            }
            )
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "Permission not found");

            }
            )
        return permission;
    }
    // find all permissions
    async findPermissions(filter: Record<string, any>): Promise<IPermissionDoc[]> {
        const foundPermissions = Permission.find(filter).then(function (permissions) {
            return permissions as IPermissionDoc[]
        }
        )
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "Permission not found");

            }
            )
        return foundPermissions;

    }

    // delete one permission

    async deletePermission(filter: Record<string, any>): Promise<IPermissionDoc> {
        const deletedPermission = Permission.findOneAndDelete(filter).then(function (permission) {
            return permission as IPermissionDoc
        }
        )
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "Permission not found");

            }
            )
        return deletedPermission;

    }



}



