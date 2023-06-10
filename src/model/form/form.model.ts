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
/** 
 * for financial form table
 */

// form table column
export interface ITableColumn {
    name: string;
    type: 'string' | 'number' | 'boolean';
}
export interface ITableColumnDoc extends ITableColumn, Document { }
export interface ITableColumnModel extends mongoose.Model<ITableColumnDoc> { }
export interface ITableData {
    [key: string]: string | number | boolean;
}
// form table row
export interface ITable {
    columns: ITableColumn[];
    rows: Record<string, ITableData>;
}
export interface ITableDoc extends ITable, Document { }
export interface ITableModel extends mongoose.Model<ITableDoc> { }


/**
 * ^^^^^^^^^^^^^^^^^^ table^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 */
export interface IForm {
    title: string,
    description: string,
    tenderId: mongoose.Types.ObjectId,
    type: FormType,
    fields?: IFormFields[],
    table?: ITable,
}
export interface IFormDoc extends IForm, Document {
}

export type NewForm = Omit<IForm, 'createdAt' | 'updatedAt'>
export type NewFormFields = Omit<IFormFields, 'id'>
export type UpdateFormBody = Partial<IForm>

export interface IFormModel extends Model<IFormDoc> {
    paginate: (filter: any, options: any) => Promise<any>
}
