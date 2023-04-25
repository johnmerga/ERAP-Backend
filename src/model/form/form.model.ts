import mongoose, { Model, Document } from 'mongoose'
import { FormQuestionType, FormType } from './form.types'

export interface IFormFields {
    question: string,
    type: FormQuestionType,
    options?: string[],
    required: boolean,

}
export interface IForm {
    title: string,
    description: string,
    tenderId: mongoose.Types.ObjectId,
    type: FormType,
    fields: IFormFields[],
    createdAt: Date,
    updatedAt: Date,
}

export interface IFormDoc extends IForm, Document {
}

export type NewForm = Omit<IForm, 'createdAt' | 'updatedAt'>
export type UpdateFormBody = Partial<IForm>

export interface IFormModel extends Model<IFormDoc> {
}
