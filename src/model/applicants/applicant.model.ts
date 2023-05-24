import { Model, Document } from "mongoose";
import { QueryResult } from "../../utils";


export interface IApplicant {
    tenderId: string,
    orgId: string,
    isApplicationSubmitted: boolean,
    paymentId: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface IApplicantDoc extends IApplicant, Document {
}
export type NewApplicant = Omit<IApplicant, 'createdAt' | 'updatedAt'>
export type ApplicantQuery = Partial<Omit<IApplicant, 'createdAt' | 'updatedAt'>>
export type ApplicantForOneTender = Pick<IApplicant, 'tenderId' | 'orgId'>

export interface IApplicantModel extends Model<IApplicantDoc> {
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
