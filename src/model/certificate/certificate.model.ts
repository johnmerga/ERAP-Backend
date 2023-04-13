import  { Model, Document } from "mongoose";

export interface ICertificate {
    name: string;
    photo: string;
    certNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICertificateDoc extends ICertificate, Document {
}

export type NewCertificate = Omit<ICertificate, 'createdAt' | 'updatedAt' >

export type UpdateCertificateBody = Partial<ICertificate>

export interface CertificateModel extends Model<ICertificateDoc> {
}
