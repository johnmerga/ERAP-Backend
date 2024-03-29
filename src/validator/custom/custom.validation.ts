import { CustomHelpers, ErrorReport, } from 'joi';

export const objectId = (value: string, helpers: CustomHelpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' });
    }
    return value;
};
export const capitalizeFirstLetter = (value: string, helpers: CustomHelpers) => {
    return value.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
};

export const password = (value: string, helpers: CustomHelpers) => {
    if (value.length < 8) {
        return helpers.message({ custom: 'password must be at least 8 characters' });
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message({ custom: 'password must contain at least 1 letter and 1 number' });
    }
    return value;
};

// custom array validator 
export const customArrayValidator = (value: string, helpers: CustomHelpers): string[] | ErrorReport => {
    try {
        if (!value.match(/^\[.*\]$/)) {
            return helpers.message({ custom: 'the value must be an array. example => [300,100]' });
        }
        const parsedArray = JSON.parse(value)
        if (!Array.isArray(parsedArray)) {
            throw new Error('Invalid array format');
        }
        return parsedArray as string[];
    } catch (error) {
        return helpers.message({ custom: 'invalid array format' });
    }
}

// // custom query validator for comparing that accepts only array of string and joi schema
// export const customQueryCompareValidator = (value: string, helpers: CustomHelpers, schema: Schema) => {
//     try {
//         const customArrayValidate = customArrayValidator(value, helpers)
//         const { error } = schema.validate(customArrayValidate)
//         if (error) {
//             return helpers.error(error.message)
//         }
//         return customArrayValidate
//     } catch (error) {
//         return helpers.message({ custom: 'invalid array format' });
//     }
// }