import joi from 'joi';
// const createFileBody: Record<string, any> = {
//     filename: joi.string().required().trim(),
// }

export const uploadFile = {
    params: joi.object().keys({
        filename: joi.string().required().trim(),
    }),
}