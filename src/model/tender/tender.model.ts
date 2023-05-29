import { Model, Document, } from "mongoose";
import { TenderStatus, TenderType } from './tender.status'
import { ORG_SECTOR_TYPE } from "../organization";
import { QueryResult } from "../../utils";
TenderStatus
export interface ITender {
    orgId: string,
    title: string,
    description: string,
    type: TenderType,
    sector: ORG_SECTOR_TYPE,
    qualifications: string[],
    status: TenderStatus,
    openDate: Date,
    bidDeadline: Date,
    closeDate: Date,
    applicants: string[],
    price: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface ITenderDoc extends ITender, Document {
}

export type NewTender = Omit<ITender, 'applicants' | 'createdAt' | 'updatedAt'>
export type NewTenderInput = Omit<ITender, | 'createdAt' | 'updatedAt'>
export type NewTenderInputValidator = Omit<NewTender, 'orgId'>
export type UpdateTender = Partial<NewTender>
// for querying tender 
export interface ITenderQuery {
    openDate?: [Date | undefined, Date | undefined],
    bidDeadline?: [Date | undefined, Date | undefined],
    closeDate?: [Date | undefined, Date | undefined],
    price?: [Date | undefined, number | undefined],
}

export interface ITenderModel extends Model<ITenderDoc> {
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}