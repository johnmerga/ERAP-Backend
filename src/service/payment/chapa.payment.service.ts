// import axios from 'axios';
import axios, { AxiosResponse, AxiosError } from 'axios';
import config from '../../config/config'
import { Currency, IChapaPaymentInitiationResponse, IChapaPaymentVerificationResponseData, IChapaPaymentInitiation, } from '../../model/payment/';
import { ApiError } from '../../errors';
import httpStatus from 'http-status';
import { Logger } from '../../logger';



export class chapaService {
    constructor() {
        this.axiosInterceptor()
    }
    // axios interceptor
    async axiosInterceptor() {
        axios.interceptors.request.use((axiosConfig) => {
            axiosConfig.headers.Authorization = `Bearer ${config.payment.chapa.secreteKey}`;
            return axiosConfig;
        }, (error) => {
            return Promise.reject(error);
        })
    }


    async paymentInitiation(paymentInitiation: IChapaPaymentInitiation): Promise<IChapaPaymentInitiationResponse> {
        try {
            if (!paymentInitiation.currency) paymentInitiation.currency = Currency.ETB
            paymentInitiation.callback_url = `${config.baseUrl}/api/v1/payment/verify/${paymentInitiation.tx_ref}`
            paymentInitiation.return_url = `${config.baseUrl}/api/v1/payment/verify/${paymentInitiation.tx_ref}`
            const dataToBeSent = {
                ...paymentInitiation,
            }
            Logger.debug(dataToBeSent)
            const response: AxiosResponse = await axios.post(`${config.payment.chapa.chapaInitiatePaymentUrl}`, dataToBeSent, {
            })
            if (response.status >= 200 && response.status < 300) {
                const data = response.data
                data.tx_ref = paymentInitiation.tx_ref;
                return data as IChapaPaymentInitiationResponse
            } else {
                // console.log(`error occured while initiating payment: ${response.status} ${response.statusText} ${response.data.message} `)
                throw new ApiError(httpStatus.BAD_REQUEST, `error occured while initiating payment: ${response.data.message} `)
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                // `unknown error occured while initiating payment: ${error.response?.status} ${error.response?.statusText} ${error.response?.data.message}`
                Logger.debug({
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    message: error.response?.data.message
                })
                throw new ApiError(httpStatus.BAD_REQUEST, `unknown error occured while initiating payment: ${error.response?.data.message}`)
            } else {
                throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while initiating payment`)
            }
        }

    }
    async paymentVerification(tx_ref: string): Promise<IChapaPaymentVerificationResponseData> {
        try {
            const response: AxiosResponse = await axios.get(`${config.payment.chapa.chapaVerifyPaymentUrl}${tx_ref}`)
            if (response.status >= 200 && response.status < 300) {
                const data = response.data
                return data as IChapaPaymentVerificationResponseData
            } else {
                throw new ApiError(httpStatus.BAD_REQUEST, `error occured while verifying payment: ${response.data.message} `)
            }

        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(httpStatus.BAD_REQUEST, `system Error: error occured while verifying payment`)
        }
    }
}
