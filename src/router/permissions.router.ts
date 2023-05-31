import { Router } from "express"
import { validate } from "../validator/custom"
import { permissionValidator } from "../validator"
import { PermissionController } from "../controller/";

export class PermissionRouter {
    public router: Router;
    private permissionController: PermissionController;
    constructor() {
        this.router = Router();
        this.permissionController = new PermissionController();
    }
    routes() {
        this.router.get('/', validate(permissionValidator.getPermissionByRole), this.permissionController.getPermissionByRole);
        return this.router
    }
}