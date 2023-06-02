import { model, Schema } from "mongoose";
import { ISubmissionDoc, ISubmissionModel } from "./submission.model";
import { toJSON, paginate } from "../../utils";
import { answerSchema } from "./answer.schema";


const submissionSchema = new Schema<ISubmissionDoc, ISubmissionModel>({
    tenderId: {
        type: Schema.Types.ObjectId,
        ref: "Tender",
        required: true,
    },
    orgId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    formId: {
        type: Schema.Types.ObjectId,
        ref: "Form",
        required: true,
    },
    answers: [answerSchema],
    score: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

submissionSchema.plugin(toJSON);
submissionSchema.plugin(paginate);


export const Submission = model<ISubmissionDoc, ISubmissionModel>("Submission", submissionSchema);