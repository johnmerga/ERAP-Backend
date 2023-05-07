import { model, Schema } from "mongoose";
import { ISubmissionDoc, ISubmissionModel } from "./submission.model";
import { toJSON, paginate } from "../../utils";
import { answerSchema } from "./answer.schema";


const submissionSchema = new Schema<ISubmissionDoc, ISubmissionModel>({
    tenderId: {
        type: String,
        ref: "Bid",
        required: true,
    },
    orgId: {
        type: String,
        ref: "Org",
        required: true,
    },
    formId: {
        type: String,
        ref: "Form",
        required: true,
    },
    answers: [answerSchema],
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