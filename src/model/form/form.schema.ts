import { Schema, model } from "mongoose";
import { IFormDoc, IFormFieldsDoc, IFormFieldsModel, IFormModel, IFormTable, IFormTableModel } from "./form.model";
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
// 
export const formTableSchema = new Schema<IFormTable, IFormTableModel>({
    row: [{
        type: String,
    }],
    column: [{
        type: String,
    }],

})
formTableSchema.plugin(toJSON);

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
    fields: [formFieldSchema],
    table: [formTableSchema],
}, {
    timestamps: true
})

formSchema.plugin(toJSON);
formSchema.plugin(paginate);
// 
formFieldSchema.plugin(toJSON);

export const FormField = model<IFormFieldsDoc, IFormFieldsModel>("FormField", formFieldSchema);
export const Form = model<IFormDoc, IFormModel>("Form", formSchema);
