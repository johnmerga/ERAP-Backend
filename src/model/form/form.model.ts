import mongoose, { Model, Document } from 'mongoose'
import { FormQuestionType, FormType } from './form.types'

export interface IFormFields {
    id: string,
    question: string,
    type: FormQuestionType,
    options?: string[],
    description?: string,
    value: number,
    required: boolean,

}

export interface IFormFieldsDoc extends IFormFields, Document {
    id: string,
}
export interface IFormFieldsModel extends Model<IFormFieldsDoc> { }
export interface IFormTable {
    row: string[],
    column: string[],
}
export interface IFormTableDoc extends IFormTable, Document { }
export interface IFormTableModel extends Model<IFormTableDoc> { }
export interface IForm {
    title: string,
    description: string,
    tenderId: mongoose.Types.ObjectId,
    type: FormType,
    fields: IFormFields[],
    table?: IFormTable[],
}

export interface IFormDoc extends IForm, Document {
}

export type NewForm = Omit<IForm, 'createdAt' | 'updatedAt'>
export type NewFormFields = Omit<IFormFields, 'id'>
export type UpdateFormBody = Partial<IForm>

export interface IFormModel extends Model<IFormDoc> {
    paginate: (filter: any, options: any) => Promise<any>
}
