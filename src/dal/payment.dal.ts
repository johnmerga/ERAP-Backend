import { IPaymentInfo, IPaymentInfoDoc, PaymentInfo, PaymentStatus } from "../model/payment/";
import { ApiError } from "../errors";
import httpStatus from "http-status";




export class PaymentDal {
    async create(paymentInfo: IPaymentInfo): Promise<IPaymentInfoDoc> {
        try {
            const isTxRefUnique = await PaymentInfo.isTxRefUnique(paymentInfo.tx_ref)
            if (!isTxRefUnique) throw new ApiError(httpStatus.BAD_REQUEST, `tx_ref: ${paymentInfo.tx_ref} already exist`)
            const payment = new PaymentInfo(paymentInfo)
            await payment.save()
            if (!payment) throw new ApiError(httpStatus.BAD_REQUEST, `unable to create payment`)
            return payment;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while creating payment`)
        }

    }
    // get payment by tx_ref
    async getPaymentByTxRef(tx_ref: string): Promise<IPaymentInfoDoc> {
        try {
            const payment = await PaymentInfo.findOne({ tx_ref })
            if (!payment) throw new ApiError(httpStatus.BAD_REQUEST, `payment with tx_ref: ${tx_ref} does not exist`)
            return payment;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while getting payment`)
        }

    }

    // get payment by tenderId
    async getPaymentByTenderId(tenderId: string): Promise<IPaymentInfoDoc[]> {
        try {
            const payments = await PaymentInfo.find({ tenderId })
            if (!payments) throw new ApiError(httpStatus.BAD_REQUEST, `payment with tenderId: ${tenderId} does not exist`)
            return payments;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while getting payment`)
        }

    }

    // get payment by orgId
    async getPaymentByOrgId(orgId: string): Promise<IPaymentInfoDoc[]> {
        try {
            const payments = await PaymentInfo.find({ orgId })
            if (!payments) throw new ApiError(httpStatus.BAD_REQUEST, `payment with orgId: ${orgId} does not exist`)
            return payments;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while getting payment`)
        }

    }

    // get payment by formId
    async getPaymentByFormId(formId: string): Promise<IPaymentInfoDoc[]> {
        try {
            const payments = await PaymentInfo.find({ formId })
            if (!payments) throw new ApiError(httpStatus.BAD_REQUEST, `payment with formId: ${formId} does not exist`)
            return payments;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while getting payment`)
        }

    }

    // get payment by paymentStatus
    async getPaymentByPaymentStatus(paymentStatus: PaymentStatus): Promise<IPaymentInfoDoc[]> {
        try {
            const payments = await PaymentInfo.find({ paymentStatus })
            if (!payments) throw new ApiError(httpStatus.BAD_REQUEST, `payment with paymentStatus: ${paymentStatus} does not exist`)
            return payments;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while getting payment`)
        }

    }

    // get payment by orgId and tenderId
    async getPaymentByOrgIdAndTenderId(orgId: string, tenderId: string): Promise<IPaymentInfoDoc> {
        try {
            const payment = await PaymentInfo.findOne({ orgId, tenderId })
            if (!payment) throw new ApiError(httpStatus.BAD_REQUEST, `payment with orgId: ${orgId} and tenderId: ${tenderId} does not exist`)
            return payment;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while getting payment`)
        }

    }

    // update payment status
    async updatePaymentStatus(tx_ref: string, paymentStatus: PaymentStatus): Promise<IPaymentInfoDoc> {
        try {
            const payment = await PaymentInfo.findOneAndUpdate({ tx_ref }, { paymentStatus }, { new: true })
            if (!payment) throw new ApiError(httpStatus.BAD_REQUEST, `payment with tx_ref: ${tx_ref} does not exist`)
            return payment;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while updating payment`)
        }

    }
}
