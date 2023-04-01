import { PermissionService } from "../../service/permission.service";

import { permissionList } from "../../model/permission";


const permissionService = new PermissionService();

const allPermission = permissionList.auctionPlatformPermissions
import * as db from "../connect"
db.connect()

allPermission.forEach(p => {
    permissionService.createPermission({
        name: p,
        description: p.split(':').join()
    })
})
console.log('good')