import mongoose, { Model, Document, Types } from "mongoose";
import { QueryResult } from "../../utils";


export interface IApplicant {
    tenderId: Types.ObjectId,
    orgId: Types.ObjectId,
    isApplicationSubmitted: boolean,
    paymentId: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
}

export interface IApplicantDoc extends IApplicant, Document {
}
export type NewApplicant = Omit<IApplicant, 'createdAt' | 'updatedAt'>
export type     ApplicantQuery = Partial<Omit<IApplicant, 'createdAt' | 'updatedAt'>>
export type ApplicantForOneTender = Pick<IApplicant, 'tenderId' | 'orgId'>
export type NewApplicantForInvitedTender = Omit<IApplicant, 'createdAt' | 'updatedAt' | 'paymentId'>

export interface IApplicantModel extends Model<IApplicantDoc> {
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
