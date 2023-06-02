import { Model, Document, Schema, Types } from "mongoose"
import { IAnswer, NewAnswer } from "./answer.model";

export interface ISubmission {
    tenderId: Types.ObjectId;
    orgId: Types.ObjectId;
    formId: Types.ObjectId;
    answers: IAnswer[];
    score?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISubmissionDoc extends ISubmission, Document {
    giveMark(answerId: Schema.Types.ObjectId, mark: number): Promise<void>;
}
export interface ISubmissionModel extends Model<ISubmissionDoc> {
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<any>;
}


export type NewSubmissionValidator = {
    tenderId: string;
    formId: string;
    answers: NewAnswer[];
}
export type NewSubmissionInput = NewSubmissionValidator & {
    orgId: string;
}
export type UpdateSubmissionBody = Partial<ISubmission>
