// import express, { Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


// Create a storage engine for multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    },
});

// Set up file size and type restrictions
export const upload = multer({
    storage,
    limits: {
        fileSize: 2000000 // 2MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/; // Allowed file types
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and GIF files are allowed.'));
        }
    },
});

// app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
//     // File is uploaded and stored with a unique filename in the 'uploads' folder
//     res.json({ message: 'File uploaded successfully' });
// });

// app.get('/file/:filename', (req: Request, res: Response) => {
//     const { filename } = req.params;
//     const filePath = path.join(__dirname, 'uploads', filename);

//     res.sendFile(filePath);
// });







// import multer from 'multer';
// import { Response, NextFunction, Request } from 'express';
// import { ApiError } from '../errors';
// import httpStatus from 'http-status';
// import { ORG_FILE_FIELD_NAME } from '../model/organization';
// import { NewOrgValidator } from '../model/organization';

// // interface IOrgFile {
// //     profilePicture: Buffer,
// //     license: Buffer,
// //     certificates: Buffer[]
// // }

// const storage = multer.memoryStorage();
// export const orgFileUploadForImageMiddleware = multer({
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
//         if (!file.originalname.match(/\.(pdf)$/)) {
//             return cb(new Error('Please upload an pdf file'));
//         }
//         cb(null, true)
//     }
// });


// interface ICertificate {
//     fileName: string,
//     photo: Buffer
// }
// export const orgFileGrabberMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     try {
//         if (!req.files) {
//             return next(new ApiError(httpStatus.BAD_REQUEST, 'No file uploaded'));
//         }
//         //validate the files
//         // const { error } = joi.object({ files: orgFileUpload.files }).validate(req.files)
//         // if (error) {
//         //     return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
//         // }
//         // parse body

//         if (!req.body.data) return next(new ApiError(httpStatus.BAD_REQUEST, 'data is required'))
//         const body = JSON.parse(req.body.data)
//         if (req.files.length !== 0) {
//             // const { error } = createOrg.body.validate(req.body)
//             // if (error) {
//             //     return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
//             // }
//             const allFiles = {
//                 profilePicture: Buffer.from(''),
//                 license: Buffer.from(''),
//                 certificates: [] as ICertificate[]
//             }
//             const requestFiles = req.files as Express.Multer.File[]
//             for (let i = 0; i < requestFiles.length; i++) {
//                 const file = requestFiles[i]
//                 if (file.fieldname === ORG_FILE_FIELD_NAME.PROFILE_PICTURE) {
//                     allFiles.profilePicture = file.buffer
//                 } else if (file.fieldname === ORG_FILE_FIELD_NAME.LICENSE) {
//                     allFiles.license = file.buffer
//                 } else if (file.fieldname === ORG_FILE_FIELD_NAME.CERTIFICATES) {
//                     allFiles.certificates.push({
//                         fileName: file.originalname,
//                         photo: file.buffer,
//                     })
//                 }
//             }
//             const newBody = body as NewOrgValidator
//             newBody.profilePicture = allFiles.profilePicture.toString('base64')
//             newBody['license']['photo'] = allFiles.license.toString('base64')
//             // for the certificates check for each certificates  the file name matches and if it matches add to on it's own certificate object
//             if (newBody.certificates) {
//                 newBody.certificates.forEach((cert, index) => {
//                     const foundCert = allFiles.certificates.find(c => c.fileName === cert.name)
//                     if (foundCert) {
//                         newBody.certificates![index].photo = foundCert.photo
//                     }
//                 })
//             }
//             req.body = newBody

//             return next()
//         }

//         return next()
//     } catch (error) {
//         if (error instanceof ApiError) return next(error)
//         const err = error as Error
//         return next(new ApiError(httpStatus.BAD_REQUEST, `system error: ${err.message}`))
//     }
// }


