import { Model, Document, Types } from "mongoose";
import { QueryResult } from "../../utils";

export interface IOrganization {
    name: string;
    type: string;
    tinNo: string;
    capital: Number;
    sector: string;
    status: string;
    license: Types.Subdocument;
    certificates: Types.Subdocument[];
    address: Types.Subdocument;
    rating: Number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrganizationDoc extends IOrganization, Document {
    
}
export type NewOrg = Omit<IOrganization,'rating' | 'createdAt' | 'updatedAt' >

export type UpdateOrgBody = Partial<IOrganization> 

export interface OrganizationModel extends Model<IOrganizationDoc> {
    isNameTaken(name: string): Promise<boolean>;
    isTinNumberTaken(tinNumber: string): Promise<boolean>;
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
