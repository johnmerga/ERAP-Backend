import { randomUUID, } from "crypto";
import { PaymentDal, } from "../../dal";
import { IPaymentInfo, IPaymentInfoDoc, NewPaymentInputType, NewPaymentInputTypeFormatter, PaymentParams, SuccessPaymentResponse } from "../../model/payment/payment.model";
import { IChapaPaymentInitiation, PaymentInfo, PaymentStatus } from "../../model/payment";
import { chapaService, TenderService, ApplicantService, FormService, OrgService } from "../../service";
import { IUserDoc } from "../../model/user";
import { ApiError } from "../../errors";
import httpStatus from "http-status";
import { Logger } from "../../logger";
import { IOptions, QueryResult } from "../../utils";
import { NewApplicant } from "../../model/applicants";
import { TenderStatus, TenderType } from "../../model/tender";
import mongoose from "mongoose";


export class PaymentService {
    private chapaService: chapaService;
    private paymentDal: PaymentDal;
    private formService: FormService;
    private tenderService: TenderService;
    private applicantService: ApplicantService;
    private orgService: OrgService
    constructor() {
        this.chapaService = new chapaService();
        this.paymentDal = new PaymentDal();
        this.tenderService = new TenderService();
        this.applicantService = new ApplicantService();
        this.formService = new FormService();
        this.orgService = new OrgService()
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
            const tender = (await this.tenderService.getTenderById(inputData.tenderId.toString(), user))
            const org = await this.orgService.findOrgById(user.orgId.toString())
            if (org.status !== 'VERIFIED') throw new ApiError(httpStatus.BAD_REQUEST, `payment can't proceed because your organization is not verified`)
            if (tender.type === TenderType.INVITATION) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'You can not apply for an invitation tender')
                // const applicant = await this.applicantService.getOneByOrgIdAndTenderId(user.orgId, new mongoose.Types.ObjectId(inputData.tenderId))
                // if (!applicant) throw new ApiError(httpStatus.BAD_REQUEST, 'You are not invited for this tender')
                // const queryFormByTenderId = await this.formService.queryForms({ tenderId: tender.id }, {})
                // if (queryFormByTenderId.totalResults === 0) throw new ApiError(httpStatus.BAD_REQUEST, `No form found for this tender: ${tender.id}`)
                // const input = await this.formatPaymentBody({
                //     ...inputData,
                //     orgId: applicant.orgId,
                //     amount: tender.price
                // });
                // const inputForChapa: IChapaPaymentInitiation = {
                //     first_name: input.payerInfo.first_name,
                //     last_name: input.payerInfo.last_name,
                //     email: input.payerInfo.email,
                //     amount: input.amount,
                //     return_url: input.return_url,
                //     tx_ref: input.tx_ref
                // }
                // Logger.debug(inputForChapa)
                // const chapaResponse = await this.chapaService.paymentInitiation(inputForChapa);
                // const paymentInfo = (await this.paymentDal.create(input))
                // if (!chapaResponse.data?.checkout_url) throw new ApiError(httpStatus.BAD_REQUEST, 'chapa payment initiation failed')
                // return {
                //     paymentInfo: paymentInfo.toJSON(),
                //     paymentUrl: chapaResponse.data?.checkout_url
                // }
            }
            if (tender.status !== TenderStatus.PUBLISHED) throw new ApiError(httpStatus.BAD_REQUEST, 'Tender is not published yet');
            const queryFormByTenderId = await this.formService.queryForms({ tenderId: tender.id }, {})
            if (queryFormByTenderId.totalResults === 0) {
                throw new ApiError(httpStatus.BAD_REQUEST, `No form found for this tender: ${tender.id}`)
            }
            const applicant = await this.applicantService.getByOrgIdAndTenderIdList(user.orgId.toString(), tender.id)
            if (applicant.results.length > 0) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'You have already applied for this tender')
            }
            const input = await this.formatPaymentBody({
                ...inputData,
                orgId: user.orgId,
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
                orgId: new mongoose.Types.ObjectId(paymentInfo.orgId),
                tenderId: new mongoose.Types.ObjectId(paymentInfo.tenderId),
                paymentId: paymentInfo.id,

            }
            // check if applicant exist
            const applicant = await this.applicantService.getByOrgIdAndTenderIdList(paymentInfo.orgId.toString(), paymentInfo.tenderId.toString())
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
