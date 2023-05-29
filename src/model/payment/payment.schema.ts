import { Schema, model } from "mongoose";
import { IPaymentInfo, IPaymentInfoModel } from "./payment.model";
import { PaymentStatus, PaymentType } from "./payment.type";
import { paginate, toJSON } from "../../utils";


// Schema for a payment information
const paymentInfoSchema = new Schema<IPaymentInfo, IPaymentInfoModel>({
    orgId: {
        type: String,
        required: true,
        ref: "Organization",
    },
    tenderId: {
        type: String,
        required: true,
        ref: "Tender",
    },
    tx_ref: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        required: true
    },
    paymentType: {
        type: String,
        required: true,
        enum: Object.values(PaymentType)
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: Object.values(PaymentStatus)
    },
})

paymentInfoSchema.statics.isTxRefUnique = async function (tx_ref: string): Promise<boolean> {
    const paymentInfo = await this.findOne({ tx_ref })
    return !paymentInfo
}
paymentInfoSchema.methods.makePaymentSuccess = async function (): Promise<void> {
    this.paymentStatus = PaymentStatus.Success;
    await this.save();
}
paymentInfoSchema.plugin(toJSON)
paymentInfoSchema.plugin(paginate)

export const PaymentInfo = model<IPaymentInfo, IPaymentInfoModel>('PaymentInfo', paymentInfoSchema)