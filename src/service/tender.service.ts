import httpStatus from "http-status";
import { TenderDal } from "../dal/tender.dal";
import { ApiError } from "../errors";
import { ITenderDoc, ITenderQuery, NewTender, Tender, TenderStatus, TenderType, UpdateTender } from "../model/tender";
import { IOptions, QueryResult } from "../utils";
import { Applicant, ApplicantQuery, } from "../model/applicants";
import { ApplicantService } from "./applicant.service";
import { IUserDoc } from "../model/user";
import { OrgService } from "./org.service";
import { IOrganizationDoc, ORG_STATUS, Organization } from "../model/organization";
import { returnComparedObj } from "../utils/compareQuery";
import mongoose from "mongoose";

export class TenderService {
    private tenderDal: TenderDal;
    private applicantService: ApplicantService;
    private orgService: OrgService
    constructor() {
        this.tenderDal = new TenderDal()
        this.applicantService = new ApplicantService()
        this.orgService = new OrgService()
    }

    async create(tenderBody: NewTender, user: IUserDoc): Promise<ITenderDoc> {
        const org = await this.orgService.findOrgById(user.orgId.toString())
        if (org.status !== ORG_STATUS.VERIFIED) throw new ApiError(httpStatus.BAD_REQUEST, 'Your organization is not verified, please contact the admin')
        return await this.tenderDal.create({
            ...tenderBody,
            applicants: [],
        })
    }
    async inviteTender(tenderID: string, orgIds: string[], owner: IUserDoc) {
        try {
            const tenderId = new mongoose.Types.ObjectId(tenderID)
            const tender = await this.getTenderById(tenderId.toString(), owner)
            if (tender.orgId.toString() !== owner.orgId.toString()) throw new ApiError(httpStatus.BAD_REQUEST, 'You can not invite for a tender that is not yours')
            if(tender.type !== TenderType.INVITATION) throw new ApiError(httpStatus.BAD_REQUEST, 'You can not invite for a tender that is not an invitation')
            const listOfOrgIds = orgIds.map(org => new mongoose.Types.ObjectId(org))
            // check if the orgs are verified and exist
            const verifiedOrgs = await Organization.find({ _id: { $in: listOfOrgIds }, status: ORG_STATUS.VERIFIED })
            const verifiedOrgsIds = verifiedOrgs.map(org => org._id)
            const invitedOrg = await Promise.all(verifiedOrgs.map(async org => {
                const applicant = await Applicant.findOne({
                    tenderId: tenderId,
                    orgId: org._id,
                });
                if (!applicant) {
                    return await Applicant.create({
                        tenderId: tenderId,
                        orgId: org._id,
                        isApplicationSubmitted: false,
                        paymentId: new mongoose.Types.ObjectId(),
                    })
                }
                return applicant
            }))

            // add to org's invitation tender 
            const invitedOrgs = await Promise.all(verifiedOrgs.map(async org => {
                const orgUpdate = await this.orgService.findOrgById(org._id)
                if (orgUpdate.tenderInvitations && !orgUpdate.tenderInvitations.includes(tenderId)) {
                    orgUpdate.tenderInvitations.push(tenderId);
                    await orgUpdate.save();
                    return orgUpdate;
                }
                return orgUpdate

            }))

            // check if all the orgs are invited
            if (invitedOrgs.some((org => !(org !== null || org !== undefined)))) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `system error: error occured while sending tender invitation`)

            if (invitedOrg.length === 0) throw new ApiError(httpStatus.BAD_REQUEST, 'All the orgs you are trying to invite are already invited')
            const newInvitedApplicant = await Applicant.find({ tenderId: tenderId, orgId: { $in: verifiedOrgsIds } })
                .populate({
                    path: "orgId",
                    select: "name"
                })
                .select("orgId").lean()
            const modifiedInvitedApplicant = newInvitedApplicant.map((applicant: Record<string, any>) => ({
                [`organization name`]: applicant.orgId.name,
                id: applicant._id,
            }));



            return {
                statusCode: httpStatus.OK,
                message: `tender invitation sent successfully`,
                data: modifiedInvitedApplicant
            }


        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `system error: error occured while sending tender invitation`)
        }
    }
    // get invited tenders
    async getInvitedTenders(user: IUserDoc,): Promise<ITenderDoc[]> {
        try {
            const populatedUser = await user.populate('orgId')
            if (!populatedUser.orgId) throw new ApiError(httpStatus.BAD_REQUEST, 'you have to be logged in to access this route')
            const orgPopulated = (populatedUser.orgId as unknown as IOrganizationDoc).tenderInvitations
            if (!orgPopulated) throw new ApiError(httpStatus.NOT_FOUND, 'you have no tender invitations')
            const tenderIds = orgPopulated.map(tender => tender._id)
            const tenders = await Tender.find({
                _id: { $in: tenderIds },
                status: TenderStatus.PUBLISHED,
                type: TenderType.INVITATION
            })
            if (!tenders) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Tenders not found')
            }
            return tenders


        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong')
        }
    }

    async getTenderById(tenderId: string, user: IUserDoc): Promise<ITenderDoc> {
        try {
            const tender = await this.tenderDal.getTender(tenderId)
            if (user.orgId.toString() !== tender.orgId.toString()) {
                if (tender.status !== TenderStatus.PUBLISHED) throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to access this tender')
                if (tender.type === TenderType.INVITATION) {
                    // checking in the list of applicants if the user is invited
                    const applicant = await this.applicantService.getOneByOrgIdAndTenderId(user.orgId, new mongoose.Types.ObjectId(tenderId))
                    if (!applicant) throw new ApiError(httpStatus.FORBIDDEN, 'You are not invited for this tender')
                    return tender
                } else {
                    // const applicant = await (await this.applicantService.getOneByOrgIdAndTenderId(user.orgId, new mongoose.Types.ObjectId(tenderId))).populate('paymentId')
                    // if (!applicant) throw new ApiError(httpStatus.FORBIDDEN, `you need to apply for this tender before you can access it`)
                    // const paymentInfo = applicant.paymentId as unknown as IPaymentInfoDoc
                    // if (paymentInfo.paymentStatus !== PaymentStatus.Success) throw new ApiError(httpStatus.PAYMENT_REQUIRED, `payment required`)
                    return tender
                }

            }
            if (tender.orgId.toString() !== user.orgId.toString()) throw new ApiError(httpStatus.FORBIDDEN, 'You are not allowed to access this tender')
            return tender
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `system error: error occured while getting a tender with id: [${tenderId}] `)
        }
    }
    async queryTenders(filter: Record<string, any>, options: IOptions, compare?: ITenderQuery): Promise<QueryResult> {
        try {
            if (compare) {
                let comparators = returnComparedObj(compare)
                options = {
                    ...options,
                    compare: comparators
                }
            }
            const tenders = await Tender.paginate(filter, options)
            if (!tenders) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Tenders not found')
            }
            return tenders
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong')
        }
    }
    async queryPublishedTenders(user: IUserDoc, filter: Record<string, any>, options: IOptions, compare?: ITenderQuery,): Promise<QueryResult> {
        try {
            if (compare) {
                let comparators = returnComparedObj(compare)
                options = {
                    ...options,
                    compare: comparators
                }
            }
            const tenders = await Tender.paginate({
                ...filter,
                orgId: { $ne: user.orgId },
                status: 'PUBLISHED',
                type: TenderType.PUBLIC
            }, options)
            if (!tenders) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Tenders not found')
            }
            return tenders
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong')
        }
    }

    // get only my tenders
    async queryMyTenders(user: IUserDoc, filter: Record<string, any>, options: IOptions, compare?: ITenderQuery,): Promise<QueryResult> {
        try {
            if (compare) {
                let comparators = returnComparedObj(compare)
                options = {
                    ...options,
                    compare: comparators
                }
            }
            const tenders = await Tender.paginate({
                ...filter,
                orgId: user.orgId
            }, options)
            if (!tenders) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Tenders not found')
            }
            return tenders
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong')
        }
    }
    async getTenderApplicants(tenderId: string, owner: IUserDoc): Promise<QueryResult> {
        const tender = await this.getTenderById(tenderId, owner)
        if (tender.orgId.toString() !== owner.orgId.toString()) throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not allowed to access this tender')
        const applicantQuery: ApplicantQuery = {
            tenderId: tender.id,
            orgId: new mongoose.Types.ObjectId(tender.orgId),
        }
        const applicants = await this.applicantService.getAllApplicantForOneTender(applicantQuery, {})
        return applicants
    }
    async updateTender(tenderId: string, update: UpdateTender, user: IUserDoc): Promise<ITenderDoc> {
        const tender = await this.tenderDal.getTender(tenderId)
        if (tender.orgId.toString() !== user.orgId.toString()) throw new ApiError(httpStatus.BAD_REQUEST, 'You can not update a tender that is not yours')
        if (update.status && tender.status === TenderStatus.PUBLISHED && (update.status !== TenderStatus.PUBLISHED)) throw new ApiError(httpStatus.BAD_REQUEST, 'You can not update the status of a published tender')
        return await this.tenderDal.updateTender(tenderId, update)
    }
    async deleteTender(tenderId: string, user: IUserDoc): Promise<ITenderDoc> {
        const tender = await this.tenderDal.getTender(tenderId)
        if (tender.orgId.toString() !== user.orgId.toString()) throw new ApiError(httpStatus.BAD_REQUEST, 'You can not delete a tender that is not yours')
        return await this.tenderDal.deleteTender(tenderId)
    }
}