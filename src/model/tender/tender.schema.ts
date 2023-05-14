import { Schema, model } from 'mongoose';
import { ITenderDoc, ITenderModel, TenderStatus, TenderType } from './'
import { ORG_SECTOR_TYPE } from "../organization";
import { paginate, toJSON } from "../../utils";

const tenderSchema = new Schema<ITenderDoc, ITenderModel>({
    orgId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(TenderType),
        required: true,
    },
    sector: {
        type: String,
        enum: Object.values(ORG_SECTOR_TYPE),
        required: true,
    },
    qualifications: {
        type: [String],
    },
    status: {
        type: String,
        enum: Object.values(TenderStatus),
        required: true,
    },
    openDate: {
        type: Date,
        required: true,
    },
    bidDeadline: {
        type: Date,
        required: true,
    },
    closeDate: {
        type: Date,
        required: true,
    },
    applicants: {
        type: [Schema.Types.ObjectId],
        ref: 'Applicant',
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

tenderSchema.plugin(toJSON);
tenderSchema.plugin(paginate);

export const Tender = model<ITenderDoc, ITenderModel>('Tender', tenderSchema);