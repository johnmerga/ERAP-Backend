import  { Schema, model } from "mongoose";
import {  IFormDoc, IFormFieldsDoc, IFormFieldsModel, IFormModel, ITableColumnDoc, ITableColumnModel, ITableDoc, ITableModel, } from "./form.model";
import { FormType, FormQuestionType } from "./form.types";
import { paginate, toJSON } from "../../utils";
//
const formFieldSchema = new Schema<IFormFieldsDoc, IFormFieldsModel>({
    question: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        enum: Object.values(FormQuestionType),
        required: true,
    },

    options: [{
        type: String,
    }],
    value: {
        type: Number,
        required: true,
        default: 10,
    },
    required: {
        type: Boolean,
        required: true,
    },
})
/**
 * for financial form table
 */
const columnSchema = new Schema<ITableColumnDoc, ITableColumnModel>({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['string', 'number', 'boolean'],
        required: true,
    },
})
const tableSchema = new Schema<ITableDoc, ITableModel>({
    columns: [columnSchema],
    rows: {
        type: Schema.Types.Mixed,
        validate: function (this: ITableDoc) {
            const columns = this.columns.map((column) => column.name);
            const rows = Object.keys(this.rows);
            const valuesFromRows = []
            for (const row of rows) {
                valuesFromRows.push(Object.keys(this.rows[row]))
            }
            return valuesFromRows.every((row) => row.every((value) => columns.includes(value)))
        }
    },
});

/**
 * 
 */





// 

const formSchema = new Schema<IFormDoc, IFormModel>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tenderId: {
        type: Schema.Types.ObjectId,
        ref: 'Tender',
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(FormType),
        required: true,
    },
    fields: {
        type: [formFieldSchema],
        validate: {
            validator: function (this: IFormDoc, fields: any[]) {
                if (this.type === FormType.TECHNICAL) {
                    // check if the table has values then if it has return false
                    if (this.table && this.table.columns.length > 1 || (this.table && ((Object.keys(this.table.rows).length > 0)))) return false
                    return fields.length > 0
                }
                return true
            },
            message: `the error could be theses: 1- fields is required for technical form. 2- table should'nt be provided at all 3- fields should not be empty for technical form. `,
        },
    },


    table: {
        type: tableSchema,
        validate: {
            validator: function (this: IFormDoc, table: any) {
                if (this.type === FormType.FINANCIAL) {
                    // check if the table has values then if it has return false
                    if (this.fields && this.fields.length > 0) return false
                    return table.columns.length > 0
                }
                return true
            },
            message: "the error could be theses: 1- table is required for financial form. 2- fields should be empty for financial form. 3- table columns should be more than 0 for financial form.",
        }
    },
}, {
    timestamps: true
})

formSchema.plugin(toJSON);
formSchema.plugin(paginate);
// 
formFieldSchema.plugin(toJSON);

export const FormField = model<IFormFieldsDoc, IFormFieldsModel>("FormField", formFieldSchema);
export const Form = model<IFormDoc, IFormModel>("Form", formSchema);
