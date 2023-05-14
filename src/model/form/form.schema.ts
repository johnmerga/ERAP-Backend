import { Schema, model } from "mongoose";
import { IFormDoc, IFormFieldsDoc, IFormFieldsModel, IFormModel } from "./form.model";
import { FormType, FormQuestionType } from "./form.types";
import { paginate, toJSON } from "../../utils";
//
const formFieldSchema = new Schema<IFormFieldsDoc, IFormFieldsModel>({
    question: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(FormQuestionType),
        required: true,
    },

    options: [{
        type: String,
    }],
    required: {
        type: Boolean,
        required: true,
    },
})

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
        ref: "Bid",
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(FormType),
        required: true,
    },
    fields: [formFieldSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

formSchema.plugin(toJSON);
formSchema.plugin(paginate);
// 
formFieldSchema.plugin(toJSON);

export const FormField = model<IFormFieldsDoc, IFormFieldsModel>("FormField", formFieldSchema);
export const Form = model<IFormDoc, IFormModel>("Form", formSchema);
