import { randomUUID, } from "crypto";
import { PaymentDal, FormDal } from "../../dal";
import { IPaymentInfo, IPaymentInfoDoc, NewPaymentInputType, NewPaymentInputTypeFormatter, PaymentParams, SuccessPaymentResponse } from "../../model/payment/payment.model";
import { IChapaPaymentInitiation, PaymentInfo, PaymentStatus } from "../../model/payment";
import { chapaService, TenderService, ApplicantService } from "../../service";
import { IUserDoc } from "../../model/user";
import { ApiError } from "../../errors";
import httpStatus from "http-status";
import { Logger } from "../../logger";
import { IOptions, QueryResult } from "../../utils";
import { NewApplicant } from "../../model/applicants";


export class PaymentService {
    private chapaService: chapaService;
    private paymentDal: PaymentDal;
    private formDal: FormDal;
    private tenderService: TenderService;
    private applicantService: ApplicantService;
    constructor() {
        this.chapaService = new chapaService();
        this.paymentDal = new PaymentDal();
        this.formDal = new FormDal();
        this.tenderService = new TenderService();
        this.applicantService = new ApplicantService();
    }
    // format the payment body
    async formatPaymentBody(paymentInfo: NewPaymentInputTypeFormatter): Promise<PaymentParams> {
        try {
            const tx_ref = `ERAP-${randomUUID().slice(0, 11)}`;
            const paymentBody: IPaymentInfo = {
                ...paymentInfo,
                tx_ref,
                date: new Date(),
                paymentStatus: PaymentStatus.Pending,
            }
            return {
                ...paymentBody,
                return_url: paymentInfo.return_url
            };

        } catch (error) {
            throw error;
        }
    }

    async payWithChapa(inputData: NewPaymentInputType, user: IUserDoc): Promise<SuccessPaymentResponse> {
        try {
            if (!user.orgId) throw new ApiError(httpStatus.BAD_REQUEST, 'User does not have an organization');
            const form = await this.formDal.getForm(inputData.formId,);
            const tender = await this.tenderService.getTenderById(form.tenderId.toString());
            const applicant = await this.applicantService.getByOrgIdAndTenderId(user.orgId.toString(), tender.id)
            if (applicant.results.length > 0) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'You have already applied for this tender')
            }
            const input = await this.formatPaymentBody({
                ...inputData,
                orgId: user.orgId.toString(),
                tenderId: form.tenderId.toString(),
                amount: tender.price
            });
            const inputForChapa: IChapaPaymentInitiation = {
                first_name: input.payerInfo.first_name,
                last_name: input.payerInfo.last_name,
                email: input.payerInfo.email,
                amount: input.amount,
                return_url: input.return_url,
                tx_ref: input.tx_ref
            }
            Logger.debug(inputForChapa)
            const chapaResponse = await this.chapaService.paymentInitiation(inputForChapa);
            const paymentInfo = (await this.paymentDal.create(input))
            if (!chapaResponse.data?.checkout_url) throw new ApiError(httpStatus.BAD_REQUEST, 'chapa payment initiation failed')
            return {
                paymentInfo: paymentInfo.toJSON(),
                paymentUrl: chapaResponse.data?.checkout_url
            }

        } catch (error) {
            throw error;
        }
    }

    async verifyChapaPayment(tx_ref: string): Promise<IPaymentInfoDoc> {
        try {
            const paymentInfo = await this.paymentDal.getPaymentByTxRef(tx_ref);
            await this.chapaService.paymentVerification(tx_ref);
            await paymentInfo.makePaymentSuccess();
            // save to applicants
            const applicantData: NewApplicant = {
                isApplicationSubmitted: false,
                orgId: paymentInfo.orgId,
                tenderId: paymentInfo.tenderId,
                paymentId: paymentInfo.id,

            }
            // check if applicant exist
            const applicant = await this.applicantService.getByOrgIdAndTenderId(paymentInfo.orgId, paymentInfo.tenderId)
            if (applicant.totalResults === 0) {
                await this.applicantService.create(applicantData)
            }
            return paymentInfo;
        } catch (error) {
            throw error;
        }
    }

    async getPaymentByTxRef(tx_ref: string): Promise<IPaymentInfoDoc> {
        try {
            const paymentInfo = await this.paymentDal.getPaymentByTxRef(tx_ref);
            return paymentInfo;
        } catch (error) {
            throw error;
        }
    }

    async getPaymentByTenderId(tenderId: string): Promise<IPaymentInfoDoc[]> {
        try {
            const paymentInfo = await this.paymentDal.getPaymentByTenderId(tenderId);
            return paymentInfo;
        } catch (error) {
            throw error;
        }
    }

    async getPaymentByOrgId(orgId: string, filter: Record<any, string>, options: IOptions): Promise<QueryResult> {
        try {
            const paymentInfos = await PaymentInfo.paginate({ orgId, ...filter }, options);
            return paymentInfos
        } catch (error) {
            throw error;
        }
    }
    // get payment by orgId and tenderId
    async canGetForm(orgId: string, tenderId: string): Promise<boolean> {
        const paymentInfo = await this.paymentDal.getPaymentByOrgIdAndTenderId(orgId, tenderId)
        if (paymentInfo.paymentStatus !== PaymentStatus.Success) {
            return false
        }
        return true
    }
}
