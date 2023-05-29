import { Model, Document } from "mongoose";
import { QueryResult } from "../../utils";
import { NewLicense } from "../license";
import { NewCertificate, UpdateCertificateBody } from "../certificate";
import { NewAddress } from "../address";
import { ORG_SECTOR_TYPE, ORG_TYPE } from './org.type'
import { ORG_STATUS } from './org.status'

export interface IOrganization {
    owner: string;
    name: string;
    type: ORG_TYPE;
    tinNo: string;
    capital: Number;
    sector: ORG_SECTOR_TYPE;
    status: ORG_STATUS;
    license: NewLicense;
    certificates: NewCertificate[];
    address: NewAddress;
    rating: Number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrganizationDoc extends IOrganization, Document {

}
export type NewOrgValidator = Omit<IOrganization, | 'rating' | 'createdAt' | 'updatedAt' | 'owner' | 'status'>
export type NewOrgInput = Omit<IOrganization, | 'rating' | 'createdAt' | 'updatedAt'>

export type UpdateOrgBody = Partial<Omit<IOrganization, 'license' | 'certificates' | 'address'>> & Partial<{
    license?: UpdateCertificateBody,
    certificates?: UpdateCertificateBody[],
    address?: UpdateCertificateBody
}>


export interface OrganizationModel extends Model<IOrganizationDoc> {
    isNameTaken(name: string): Promise<boolean>;
    isTinNumberTaken(tinNumber: string): Promise<boolean>;
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
