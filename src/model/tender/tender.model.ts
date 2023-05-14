import mongoose, { Model, Document, } from "mongoose";
import { TenderStatus, TenderType } from './tender.status'
import { ORG_SECTOR_TYPE } from "../organization";
import { QueryResult } from "../../utils";
TenderStatus
export interface ITender {
    orgId: mongoose.Types.ObjectId,
    title: string,
    description: string,
    type: TenderType,
    sector: ORG_SECTOR_TYPE,
    qualifications: string[],
    status: TenderStatus,
    openDate: Date,
    bidDeadline: Date,
    closeDate: Date,
    applicants: mongoose.Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date,
}

export interface ITenderDoc extends ITender, Document {
}

export type NewTender = Omit<ITender, 'applicants' | 'createdAt' | 'updatedAt'>
export type UpdateTender = Partial<NewTender>

export interface ITenderModel extends Model<ITenderDoc> {
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}