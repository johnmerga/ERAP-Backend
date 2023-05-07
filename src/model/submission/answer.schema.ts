import { Schema, model } from "mongoose";
import { IAnswerDoc, IAnswerModel } from "./answer.model";
import { toJSON } from "../../utils";

export const answerSchema = new Schema<IAnswerDoc, IAnswerModel>({
    questionId: {
        type: String,
        ref: "Form",
        required: true,
    },
    mark: {
        type: Number,
        default: 0,
    },
    answer: {
        type: String,
        required: true,
    },
})

answerSchema.plugin(toJSON);

export const Answer = model<IAnswerDoc, IAnswerModel>("Answer", answerSchema);