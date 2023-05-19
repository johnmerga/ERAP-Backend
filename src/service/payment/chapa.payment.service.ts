import { randomUUID } from 'crypto'
import config from '../../config/config'
import { Currency, IChapaPaymentInitiationResponse, IChapaPaymentVerificationResponse, IChapaPaymentVerificationResponseData, IPaymentInitiation, } from '../../model/payment/';
import { ApiError } from '../../errors';
import httpStatus from 'http-status';
import { Logger } from '../../logger';

export class chapaService {
    private secretKey: string;
    constructor() {
        this.secretKey = config.payment.chapa.secreteKey;
    }
    async paymentInitiation(paymentInitiation: IPaymentInitiation): Promise<IChapaPaymentInitiationResponse> {
        try {
            const tx_ref = `ERAP-${randomUUID().slice(0, 11)}`;
            if (!paymentInitiation.currency) paymentInitiation.currency = Currency.ETB
            paymentInitiation.callback_url = `${config.baseUrl}/api/v1/payment/chapa/${tx_ref}`
            paymentInitiation.return_url = `${config.clientUrl}/payment/success`
            const dataToBeSent = {
                ...paymentInitiation,
                tx_ref,
            }
            Logger.debug(dataToBeSent)
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.secretKey}`,
            }
            const response = await fetch(config.payment.chapa.chapaInitiatePaymentUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(dataToBeSent),
            })
            const responseData = await response.json() as IChapaPaymentInitiationResponse
            if (responseData.status !== 'success') throw new ApiError(httpStatus.BAD_REQUEST, responseData.message)
            responseData.tx_ref = tx_ref;

            return responseData;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while initiating payment`)
        }

    }
    async paymentVerification(tx_ref: string): Promise<IChapaPaymentVerificationResponseData> {
        try {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.secretKey}`,
            }
            const response = await fetch(config.payment.chapa.chapaVerifyPaymentUrl + tx_ref, {
                method: 'GET',
                headers,
            })
            const responseData = await response.json() as IChapaPaymentVerificationResponse

            if (responseData.status !== 'success' || !responseData.data) throw new ApiError(httpStatus.BAD_REQUEST, responseData.message)
            return responseData.data;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while verifying payment`)
        }
    }
}