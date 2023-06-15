import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils";
import httpStatus from "http-status";
import { ApiError } from "../errors";
import path from "path";
import fs from "fs";


export class FileUploadController {

    uploadFile = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const file = req.file;
            if (!file) throw new ApiError(httpStatus.BAD_REQUEST, 'file is required');
            res.status(httpStatus.OK).send(file);
        }
    );
    getFileByName = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const { name } = req.params;
            if (!name) throw new ApiError(httpStatus.BAD_REQUEST, 'fileName is required');
            const filePath = `./uploads/${name}`;
            res.sendFile(filePath, {
                root: '.',
                headers: {
                    'Content-Type': 'image/jpeg',
                },
            });
        })
        getFileBase64Format = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { filename } = req.params;
                console.log(path.join(__dirname, '../../uploads', filename));
                const filePath = path.join(__dirname, '../../uploads', filename);
                // fs.accessSync(filePath, fs.constants.R_OK,)
                // read file as binary
                const data = await fs.promises.readFile(filePath, { encoding: 'base64' });
                res.status(httpStatus.OK).send({
                    data,
                });
            } catch (error) {
                if (error instanceof ApiError) throw error;
                throw new ApiError(httpStatus.BAD_REQUEST, 'system error while getting file');
            }
        });

}