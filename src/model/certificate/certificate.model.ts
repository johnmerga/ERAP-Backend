import { Model, Document } from "mongoose";

export interface ICertificate {
    id: string;
    name: string;
    photo: string;
    certNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICertificateDoc extends ICertificate, Document {
    id: string;
}

export type NewCertificate = Omit<ICertificate, 'createdAt' | 'updatedAt' | 'id'>

export type UpdateCertificateBody = Partial<Omit<ICertificate,'createdAt'| 'updatedAt'>> & {
    id: string;
}

export interface CertificateModel extends Model<ICertificateDoc> {
}
