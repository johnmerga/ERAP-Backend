import { Model, Document } from "mongoose";

export interface ILicense {
    name: string;
    photo: string;
    licenseNumber: string;
    expDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILicenseDoc extends ILicense, Document {
}
export type NewLicense = Omit<ILicense, 'createdAt' | 'updatedAt'>
export type UpdateLicenseBody = Omit<ILicense, 'createdAt' | 'updatedAt'> & {
    id: string;
}

export interface LicenseModel extends Model<ILicenseDoc> {
}
