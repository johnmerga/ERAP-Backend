import { PermissionDal } from "../dal";
import { IPermission, IPermissionDoc, } from "../model/permission"



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
    async deletePermission(filter: Record<string, any>): Promise<IPermissionDoc> {
        const deletedPermission = await this.permissionDal.deletePermission(filter)
        return deletedPermission
    }
}
