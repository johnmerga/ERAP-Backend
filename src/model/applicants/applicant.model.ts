import mongoose, { Model, Document } from "mongoose";
import { QueryResult } from "../../utils";


export interface IApplicant {
    tenderId: mongoose.Types.ObjectId,
    orgId: mongoose.Types.ObjectId,
    isApplicationSubmitted: boolean,
    paymentId: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
}

export interface IApplicantDoc extends IApplicant, Document {
}
export type NewApplicant = Omit<IApplicant, 'createdAt' | 'updatedAt'>
export type ApplicantQuery =Partial<IApplicant>

export interface IApplicantModel extends Model<IApplicantDoc> {
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
