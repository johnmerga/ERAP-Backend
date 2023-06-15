// // // a multer middleware that accepts a pdf file and saves it buffer to req.file
// // 
// import { Schema, model } from 'mongoose';
// import { ApiError } from '../errors';
// import httpStatus from 'http-status';

// const fileSchema = new Schema({
//     fileName: {
//         type: String,
//     },
//     file: {
//         type: Buffer,
//         required: true
//     }
// })



// export const fileModel = model('file', fileSchema);



// import multer from 'multer';
// // import multer, { diskStorage, } from 'multer';
// import { Response, NextFunction, Request } from 'express';
// import joi from 'joi';

// export const validateFile = (file: Express.Multer.File) => {
//     const schema = joi.object({
//         fieldname: joi.string().required().valid('certificates', 'license', 'profilePicture'),
//         originalname: joi.string().required(),
//         encoding: joi.string().required(),
//         mimetype: joi.string().required(),
//         buffer: joi.binary().required(),
//         size: joi.number().required(),
//     })
//     return schema.validate(file)
// }

// const validateFiles = (files: Express.Multer.File[]) => {
//     const schema = joi.array().min(3).max(6).items(
//         joi.object({
//             fieldname: joi.string().required().valid('certificates', 'license', 'profilePicture'),
//             originalname: joi.string().required(),
//             encoding: joi.string().required(),
//             mimetype: joi.string().required(),
//             buffer: joi.binary().required(),
//             size: joi.number().required(),
//         })
//     ).options({
//         abortEarly: false,
//         messages: {
//             'array.includesOne': 'At least one file is required for fieldname "{#fieldname}"',
//         }
//     }).custom((value, helpers) => {
//         const validFieldnames = ['certificates', 'license', 'profilePicture'];

//         // Check that there is at least one item for each valid fieldname
//         for (const fieldname of validFieldnames) {
//             const hasItem = value.some((item: Record<string, any>) => item.fieldname === fieldname);
//             if (!hasItem) {
//                 return helpers.error('array.includesOne', { fieldname });
//             }
//         }

//         return value;
//     });

//     return schema.validate(files);
// };




// const storage = multer.memoryStorage();
// export const fileUploadForImage = multer({
//     storage,
//     limits: {
//         fileSize: 2000000,// max 2mb
//     },
//     fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
//         if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
//             return cb(new Error('Please upload an img file'));
//         }
//         cb(null, true)
//     }
// });
// export const fileUploadForFile = multer({
//     storage,
//     limits: {
//         fileSize: 2000000,// max 2mb
//     },
//     fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
//         if (!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) {
//             return cb(new Error('Please upload an img file'));
//         }
//         cb(null, true)
//     }
// });


// export const filesMiddleware = (fileNames: string[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (!req.files) {
//             return next(new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded'));
//         }
//         const files = req.files as Array<Record<string, any>>
//         for (let i = 0; i < files.length; i++) {
//             req.body[fileNames[i]] = files[i].buffer
//         }
//         return next()
//     }
// }
// interface IOrgFile {
//     profilePicture: Buffer,
//     license: Buffer,
//     certificates: Buffer[]
// }

// export const fileGrabberMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     if (!req.files) {
//         return next(new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded'));
//     }
//     //validate the files
//     const { error } = validateFiles(req.files as Express.Multer.File[])
//     if (error) {
//         return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
//     }
//     const allFiles: IOrgFile = {
//         profilePicture: Buffer.from(''),
//         license: Buffer.from(''),
//         certificates: []
//     }
//     const requestFiles = req.files as Express.Multer.File[]
//     for (let i = 0; i < requestFiles.length; i++) {
//         const file = requestFiles[i]
//         if (file.fieldname === 'profilePicture') {
//             allFiles.profilePicture = file.buffer
//         } else if (file.fieldname === 'license') {
//             allFiles.license = file.buffer
//         } else if (file.fieldname === 'certificates') {
//             allFiles.certificates.push(file.buffer)
//         }
//     }
//     req.body.file = allFiles.license
//     return next()
// }

