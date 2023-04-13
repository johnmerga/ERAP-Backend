import { Schema, model } from 'mongoose';
import { ILicense, LicenseModel } from './license.model';
import { toJSON } from '../../utils';

export const LicenseSchema = new Schema<ILicense, LicenseModel>({
    name: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
    },
    expDate: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

// Remove : not sure if we need this
LicenseSchema.plugin(toJSON);

export const License = model<ILicense, LicenseModel>('License', LicenseSchema);