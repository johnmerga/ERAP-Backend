import { Schema, model } from 'mongoose';
import { IOrganization, OrganizationModel } from './';
import { toJSON, paginate } from '../../utils'
import { AddressSchema } from '../address';
import { CertificateSchema } from '../certificate';
import { LicenseSchema } from '../license';
import {ORG_TYPE,ORG_SECTOR_TYPE,} from './org.type'
import {ORG_STATUS} from './org.status'


const OrganizationSchema = new Schema<IOrganization, OrganizationModel>({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(ORG_TYPE),
    },
    tinNo: {
        type: String,
        required: true,
    },
    capital: {
        type: Number,
        required: true,
    },
    sector: {
        type: String,
        required: true,
        enum: Object.values(ORG_SECTOR_TYPE),
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(ORG_STATUS),

    },
    license: LicenseSchema,
    certificates: [CertificateSchema],
    address: AddressSchema,
    rating: {
        type: Number
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
OrganizationSchema.plugin(toJSON)
OrganizationSchema.plugin(paginate)

// check if the name is already in use using schema.statics
OrganizationSchema.statics.isNameTaken = async function (name: string, excludeUserId?: string) {
    const organization = await this.findOne({ name, _id: { $ne: excludeUserId } });
    return !!organization;
}

// check if the tin number is already in use using schema.statics
OrganizationSchema.statics.isTinNumberTaken = async function (tinNumber: string, excludeUserId?: string) {
    const organization = await this.findOne({ tinNo: tinNumber, _id: { $ne: excludeUserId } });
    return !!organization;
}

export const Organization = model<IOrganization, OrganizationModel>('Organization', OrganizationSchema);
