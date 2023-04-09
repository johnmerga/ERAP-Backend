import { PermissionDal } from "../dal";
import { IPermission, IPermissionDoc, } from "../model/permission"
import { UserService } from "./user.service";



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
    /* get all permissions */
    async getAllUserPermissions(userId: string): Promise<string[]> {
        const userPermissionObjId = (await new UserService().findUserById(userId)).permissions
        const userPermissionIdLists = userPermissionObjId.reduce((acc: string[], curr: any) => {
            acc.push(curr.toString())
            return acc
        }
            , [])
        const userPermissionsName = userPermissionIdLists.map(async (permissionId: string) => {
            const permission = await this.findPermission({ _id: permissionId })
            return permission.name
        }
        )
        const userPermissions = await Promise.all(userPermissionsName)
        return userPermissions

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
