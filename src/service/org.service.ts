import { IOrganizationDoc, UpdateOrgBody, Organization, NewOrgValidator, ORG_STATUS, } from "../model/organization";
import { OrgDal } from "../dal";
import httpStatus from "http-status";
import { ApiError } from "../errors";
import mongoose from "mongoose";
import { IOptions, Operation, QueryResult, checkIdsInSubDocs } from "../utils";
import { UpdateCertificateBody } from "../model/certificate";
import { IUserDoc } from "../model/user";

export class OrgService {
    private orgDal: OrgDal;
    constructor() {
        this.orgDal = new OrgDal();
    }

    /* check name */
    public async isNameTaken(name: string): Promise<boolean> {
        return Organization.isNameTaken(name);
    }
    /* check TinNumber */
    public async isTinNumberTaken(TinNumber: string): Promise<boolean> {
        return Organization.isTinNumberTaken(TinNumber);
    }

    /* get all organization  */
    public async queryOrgs(
        filter: Record<string, any>,
        options: IOptions
    ): Promise<QueryResult> {
        const queryResult = await Organization.paginate(filter, options);
        return queryResult;
    }
    /*get org by type  */
    public async findOrgByType(type: string): Promise<IOrganizationDoc> {
        const org = await Organization.findOne({ type });
        if (!org) {
            throw new ApiError(httpStatus.NOT_FOUND, "Organization not found");
        }
        return org;
    }

    /* get org by id  */
    public async findOrgById(id: string): Promise<IOrganizationDoc> {
        const org = await Organization.findById(new mongoose.Types.ObjectId(id));
        if (!org) {
            throw new ApiError(httpStatus.NOT_FOUND, "Organization not found");
        }
        return org;
    }

    /* register org */
    public async create(orgBody: NewOrgValidator, user: IUserDoc): Promise<IOrganizationDoc> {
        // check if name is taken
        if (await this.isNameTaken(orgBody.name)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Name is already taken");
        }

        // check if Tin Number is taken
        if (await this.isTinNumberTaken(orgBody.tinNo)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Tin Number is already taken");
        }
        const newOrg = {
            ...orgBody,
            owner: user.id,
            status: ORG_STATUS.PENDING,
        }
        return await this.orgDal.create(newOrg);
    }

    /* update organization profile */
    public async updateOrgProfile(OrgId: string, updateBody: UpdateOrgBody): Promise<IOrganizationDoc> {
        try {
            await this.orgDal.getOneOrg(OrgId)
            const { license, certificates, address, ...otherOrgFields } = updateBody
            if (otherOrgFields && Object.keys(otherOrgFields).length > 0) {
                await this.orgDal.updateOrg(OrgId, otherOrgFields);
            }
            if (license && Object.keys(license).length > 0) {
                if (!license.id) throw new ApiError(httpStatus.BAD_REQUEST, `license id is required`)
                const isValidLicenseIds = await checkIdsInSubDocs(Organization, OrgId, 'license', [license.id])
                if (isValidLicenseIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidLicenseIds.message)

                await this.orgDal.updateOrg(OrgId, {
                    license
                }, Operation.UPDATE)
            }
            if (address) {
                if (!address.id) throw new ApiError(httpStatus.BAD_REQUEST, `address id is required`)
                const isValidAddressIds = await checkIdsInSubDocs(Organization, OrgId, 'address', [address.id])
                if (isValidAddressIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidAddressIds.message)

                await this.orgDal.updateOrg(OrgId, {
                    address
                }, Operation.UPDATE)
            }
            const latestOrgProfile = await this.orgDal.getOneOrg(OrgId)

            return latestOrgProfile
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While updating Organization Profile");
        }
    }
    // update organization rating
    public async updateOrgRating(orgId: string, updateRating: UpdateOrgBody, user: IUserDoc): Promise<IOrganizationDoc> {
        try {
            if (!updateRating.rating) throw new ApiError(httpStatus.BAD_REQUEST, 'rating should be provided')
            if (!user.orgId) throw new ApiError(httpStatus.BAD_REQUEST, `user with no organization can't rate organizations`)
            if (user.orgId.toHexString() === orgId) throw new ApiError(httpStatus.BAD_REQUEST, `you can't rate your own organization`)
            const org = await this.updateOrgProfile(orgId, updateRating)
            return org
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While updating Organization Rating");
        }
    }
    // update organization status
    public async updateOrgStatus(orgId: string, status: ORG_STATUS): Promise<IOrganizationDoc> {
        try {
            const org = await this.updateOrgProfile(orgId, { status })
            return org
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While updating Organization Status");
        }
    }
    /* delete org */
    public async deleteOrg(id: string): Promise<IOrganizationDoc> {
        return await this.orgDal.deleteOrg(new mongoose.Types.ObjectId(id));

    }

    /**
     * --------------------------------------------------------------------------------------------------------------------
     * the following methods are only for certificates
     * --------------------------------------------------------------------------------------------------------------------
     */

    /* Add new certificate to organization profile */
    public async addCertificate(orgId: string, certBody: UpdateCertificateBody[]): Promise<IOrganizationDoc> {
        await this.orgDal.getOneOrg(orgId)
        const org = await this.orgDal.updateOrg(orgId, {
            certificates: certBody,
        }, Operation.ADD)
        return org
    }
    /* update existing certificates to organization profile */
    public async updateCertificate(orgId: string, certBody: UpdateCertificateBody[]): Promise<IOrganizationDoc> {
        await this.orgDal.getOneOrg(orgId)
        const certificateIds = certBody.map((certificate) => certificate.id)
        const isValidCertificateIds = await checkIdsInSubDocs(Organization, orgId, 'certificates', certificateIds)
        if (isValidCertificateIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidCertificateIds.message)
        const org = await this.orgDal.updateOrg(orgId, {
            certificates: certBody,
        }, Operation.UPDATE)
        return org
    }

    /* Remove certificate from organization profile */
    public async deleteCertificates(orgId: string, certBody: UpdateCertificateBody[]): Promise<IOrganizationDoc> {
        await this.orgDal.getOneOrg(orgId)
        const certificateIds = certBody.map((certificate) => certificate.id)
        const isValidCertificateIds = await checkIdsInSubDocs(Organization, orgId, 'certificates', certificateIds)
        if (isValidCertificateIds instanceof Error) throw new ApiError(httpStatus.BAD_REQUEST, isValidCertificateIds.message)
        const org = await this.orgDal.updateOrg(orgId, {
            certificates: certBody,
        }, Operation.DELETE)
        return org
    }

}
