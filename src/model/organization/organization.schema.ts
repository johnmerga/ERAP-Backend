import { Schema, model } from 'mongoose';
import { IOrganization, OrganizationModel } from './organization.model';
import { toJSON, paginate } from '../../utils'

const OrganizationSchema = new Schema<IOrganization,OrganizationModel>({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
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
        required: true
    },
    status: {
        type: String,
        required: true
    },
    license: {
        type:  Schema.Types.ObjectId,
        required: true,
        ref: 'License'
    },
    certificate: {
        type: Schema.Types.ObjectId,
        ref: 'Certificate'
    },
    address: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Address'
    },
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
OrganizationSchema.statics.isNameTaken = async function (tinNumber: string, excludeUserId?: string) {
    const organization = await this.findOne({ tinNumber, _id: { $ne: excludeUserId } });
    return !!organization;
}

export const Organization = model<IOrganization, OrganizationModel>('Organization', OrganizationSchema);
