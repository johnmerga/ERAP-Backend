import { Document, Model, } from 'mongoose';
import { PaymentStatus, PaymentType } from './payment.type';

// store payer information
export interface IPayer {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

export interface IPaymentInfo {
    tenderId: string;
    orgId: string;
    formId: string;
    tx_ref: string;
    amount: number;
    payerInfo: IPayer;
    date: Date;
    paymentType: PaymentType;
    paymentStatus: PaymentStatus;
}
export type NewPaymentInputType = Omit<IPaymentInfo, | 'amount' | 'tenderId' | 'orgId' | 'tx_ref' | 'date' | 'paymentStatus'> & { return_url: string };
export type NewPaymentInputTypeFormatter = Omit<IPaymentInfo, | 'tx_ref' | 'date' | 'paymentStatus'> & { return_url: string };
export type SuccessPaymentResponse = {
    paymentInfo: IPaymentInfo;
    paymentUrl: string;
}
export type PaymentParams = { return_url: string } & IPaymentInfo;
export interface IPaymentInfoDoc extends IPaymentInfo, Document {
    // make the status Success
    makePaymentSuccess(): Promise<void>;
}
export interface IPaymentInfoModel extends Model<IPaymentInfoDoc> {
    // check if the tx_ref is unique
    isTxRefUnique(tx_ref: string): Promise<boolean>;
    // paginate the payment information
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<any>;

}
