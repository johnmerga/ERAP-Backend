export interface ICustomizations {
    title: string;
    description?: string;
    logo?: string;
}
export interface IChapaParams {
    first_name: string;
    last_name: string;
    email: string;
    amount: number;
    currency?: Currency;
    return_url: string;
    tx_ref: string;
}
export interface IChapaPaymentInitiation extends IChapaParams {
    callback_url?: string;
    customizations?: ICustomizations;
}

export interface IChapaPaymentInitiationResponse {
    status: string;
    message: string;
    data: null | {
        checkout_url: string;
    };
    tx_ref: string;
}

export enum Currency {
    ETB = 'ETB',
    USD = 'USD',
}


export interface IChapaPaymentVerificationResponseData extends IChapaParams {
    charge: number;
    mode: string;
    method: string;
    type: string;
    status: string;
    reference: string;
    tx_ref: string;
    customization: ICustomizations;
    meta: any;
    created_at: Date;
    updated_at: Date;
}
export interface IChapaPaymentVerificationResponse {
    status: string;
    message: string;
    data: IChapaPaymentVerificationResponseData | null;
}













export type NewChapaPayment = Omit<IChapaParams, 'currency'>;