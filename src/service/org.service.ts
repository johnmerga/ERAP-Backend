import { IOrganizationDoc, UpdateOrgBody, Organization, NewOrg } from "../model/organization";
import { OrgDal } from "../dal";
import httpStatus from "http-status";
import { ApiError } from "../errors";
import mongoose from "mongoose";
import { IOptions, QueryResult } from "../utils";
import { NewCertificate } from "../model/certificate";

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
    public async create(orgBody: NewOrg): Promise<IOrganizationDoc> {
        // check if name is taken
        if (await this.isNameTaken(orgBody.name)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Name is already taken");
        }
        // check if Tin Number is taken
        if (await this.isTinNumberTaken(orgBody.tinNo)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Tin Number is already taken");
        }
        return await this.orgDal.create(orgBody);
    }

    /* update organization profile */
    public async updateOrgProfile(id: string, updateBody: UpdateOrgBody
    ): Promise<IOrganizationDoc> {
        let org = await this.findOrgById(id);
        if (!org) {
            throw new ApiError(httpStatus.NOT_FOUND, "Organization not found");
        }
        if (updateBody.name && (await Organization.isNameTaken(updateBody.name))) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Name is already taken");
        }
        if (
            updateBody.tinNo &&
            (await Organization.isTinNumberTaken(updateBody.tinNo))
        ) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Tin Number is already taken");
        }
        org = await this.orgDal.updateOrg(new mongoose.Types.ObjectId(id), updateBody);
        return org;
    }
    /* delete org */
    public async deleteOrg(id: string): Promise<IOrganizationDoc> {
        return await this.orgDal.deleteOrg(new mongoose.Types.ObjectId(id));

    }

    /* Add new certificate to organization profile */
    public async addCertificate(
        id: string,
        certBody: NewCertificate
    ): Promise<IOrganizationDoc> {
        let org = await this.findOrgById(id);
        if (!org) {
            throw new ApiError(httpStatus.NOT_FOUND, "Organization not found");
        }
        org = await this.orgDal.addCertificate(new mongoose.Types.ObjectId(id), certBody);
        return org;
    }

    /* Remove certificate from organization profile */
    public async removeCertificate(orgId: string, certId: string): Promise<IOrganizationDoc> {
        let org = await this.findOrgById(orgId);
        if (!org) {
            throw new ApiError(httpStatus.NOT_FOUND, "Organization not found");
        }
        org = await this.orgDal.removeCertificate(new mongoose.Types.ObjectId(orgId), new mongoose.Types.ObjectId(certId));
        return org;
    }

}
