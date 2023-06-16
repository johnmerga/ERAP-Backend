import { Document, Model } from 'mongoose';
export interface IAnswer {
    id: string;
    questionId: string;
    answer: string
    mark: number;
}
export interface IAnswerDoc extends IAnswer, Document {
    id: string;
}
export interface IAnswerModel extends Model<IAnswerDoc> { }
export declare type NewAnswer = Omit<IAnswer, 'mark' | 'id'>;
export type AnswerEvaluation = Omit<IAnswer, 'answer' | 'questionId'>