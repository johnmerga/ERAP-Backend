import { Model, Document, Schema } from "mongoose"
import { IAnswer } from "./answer.model";

export interface ISubmission {
    tenderId: string;
    orgId: string;
    formId: string;
    answers: IAnswer[];
    createdAt: Date;
    updatedAt: Date;
}
export interface ISubmissionDoc extends ISubmission, Document {
    giveMark(answerId: Schema.Types.ObjectId, mark: number): Promise<void>;
}
export interface ISubmissionModel extends Model<ISubmissionDoc> {
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<any>;
}


export type NewSubmission = Omit<ISubmission, 'createdAt' | 'updatedAt'>
export type UpdateSubmissionBody = Partial<ISubmission>
