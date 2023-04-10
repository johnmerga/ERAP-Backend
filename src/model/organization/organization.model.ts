import { Model, Document, Types } from "mongoose";

export interface IOrganization {
    name: string;
    type: string;
    tinNo: string;
    capital: Number;
    sector: string;
    status: string;
    license: Types.ObjectId;
    certificate: Types.ObjectId;
    address: Types.ObjectId;
    rating: Number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrganizationDoc extends IOrganization, Document {
    
}

export type UpdateOrgBody = Partial<IOrganization> 

export interface OrganizationModel extends Model<IOrganizationDoc> {
    isNameTaken(name: string): Promise<boolean>;
    isTinNumberTaken(tinNumber: string): Promise<boolean>;
}
