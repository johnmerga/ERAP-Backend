import { Schema, model } from "mongoose";
import { IFormDoc, IFormModel } from "./form.model";
import { FormType, FormQuestionType } from "./form.types";
import { toJSON } from "../../utils";

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
    fields: [{
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
    }],
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
export const Form = model<IFormDoc, IFormModel>("Form", formSchema);
