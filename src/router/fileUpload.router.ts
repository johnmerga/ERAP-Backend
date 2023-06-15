import { Router } from "express";
import { FileUploadController } from "../controller"
import { upload } from "../middlewares/fileupload.middleware";

export class FileUploadRouter {
    private fileUploadController: FileUploadController;
    public router: Router;
    constructor() {
        this.router = Router()
        this.fileUploadController = new FileUploadController()
    }

    routes() {
        // upload file
        this.router.route('/').post(upload.single('file'), this.fileUploadController.uploadFile)
        // get file by name
        this.router.route('/:name').get(this.fileUploadController.getFileByName)
        // get file in base64 format
        this.router.route('/base64/:filename').get(this.fileUploadController.getFileBase64Format)

        return this.router;
    }
}