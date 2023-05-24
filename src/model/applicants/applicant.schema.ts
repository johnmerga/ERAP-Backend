import { Schema, model } from "mongoose";
import { IApplicantDoc, IApplicantModel } from "./applicant.model";
import { paginate, toJSON } from "../../utils";


const applicantSchema = new Schema<IApplicantDoc, IApplicantModel>({
    tenderId: {
        type: String,
        ref: 'Tender',
        required: true,
    },
    orgId: {
        type: String,
        ref: 'Organization',
        required: true,
    },
    isApplicationSubmitted: {
        type: Boolean,
        required: true,
    },
    paymentId: {
        type: String,
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