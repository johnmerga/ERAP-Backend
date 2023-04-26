import { Schema, model } from "mongoose";
import { IApplicantDoc, IApplicantModel } from "./applicant.model";
import { paginate, toJSON } from "../../utils";


const applicantSchema = new Schema<IApplicantDoc, IApplicantModel>({
    tenderId: {
        type: Schema.Types.ObjectId,
        ref: 'Tender',
        required: true,
    },
    orgId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    isApplicationSubmitted: {
        type: Boolean,
        required: true,
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
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

applicantSchema.plugin(toJSON);
applicantSchema.plugin(paginate);

export const Applicant = model<IApplicantDoc, IApplicantModel>('Applicant', applicantSchema);