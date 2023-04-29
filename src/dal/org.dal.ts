import mongoose from "mongoose";
import { UpdateOrgBody, Organization, IOrganizationDoc, NewOrg, } from "../model/organization";
import { ApiError } from "../errors";
import httpStatus from "http-status";
import { Certificate, NewCertificate } from "../model/certificate";
import { mergeNestedObjects } from "../utils";

export class OrgDal {
    async create(org: NewOrg): Promise<IOrganizationDoc> {
        try {
            const newOrg = await new Organization(org).save()
            if (!newOrg)
                throw new ApiError(httpStatus.BAD_REQUEST, "organization creation was unsuccessful");
            return newOrg
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While creating Organization");
        }
    }

    async findOrg(query: Record<string, unknown>): Promise<IOrganizationDoc> {
        try {
            const org = await Organization.findOne(query);
            if (!org)
                throw new ApiError(httpStatus.BAD_REQUEST, "Organization not found");
            return org
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While finding Organization");
        }
    }

    async findOrgs(query: Record<string, unknown>): Promise<IOrganizationDoc[]> {
        try {
            const orgs = await Organization.find(query);
            if (!orgs)
                throw new ApiError(httpStatus.BAD_REQUEST, "No organizations found");
            return orgs as IOrganizationDoc[];
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While finding Organizations");
        }
    }

    async updateOrg(id: mongoose.Types.ObjectId, update: UpdateOrgBody): Promise<IOrganizationDoc> {
        try {
            const org = await Organization.findById(id);
            if (!org) throw new ApiError(httpStatus.BAD_REQUEST, "Organization not found");
            const orgJSON = org.toJSON()
            let updatedOrg = mergeNestedObjects(orgJSON, update)
            Object.assign(org, updatedOrg)
            if (update.certificates)
                org.certificates = update.certificates;
            if (update.license?.expDate)
                org.license.expDate = new Date(update.license.expDate);
            org.updatedAt = new Date()
            await org.save();
            return org;
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While updating Organization");
        }
    }

    /* delete org */
    async deleteOrg(id: mongoose.Types.ObjectId): Promise<IOrganizationDoc> {
        try {
            const org = await Organization.findByIdAndDelete(id)
            if (!org) throw new ApiError(httpStatus.BAD_REQUEST, "unable to delete organization: organization not found");
            return org;
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While deleting Organization");
        }
    }
    async addCertificate(
        id: mongoose.Types.ObjectId,
        certBody: NewCertificate
    ): Promise<IOrganizationDoc> {
        try {
            const org = await Organization.findOne({ _id: id });
            if (!org) throw new ApiError(httpStatus.BAD_REQUEST, "Organization not found");
            const newCertificate = new Certificate(certBody);
            org.certificates.push(newCertificate);
            await org.save();
            return org;
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While adding Certificate");
        }
    }

    async removeCertificate(orgId: mongoose.Types.ObjectId, certId: mongoose.Types.ObjectId): Promise<IOrganizationDoc> {
        try {
            let org = await Organization.findOne({ _id: orgId });
            if (!org) throw new ApiError(httpStatus.BAD_REQUEST, "Organization not found");
            await Organization.updateOne({ _id: orgId }, { $pull: { certificates: { _id: certId } } })
            org = await Organization.findOne({ _id: orgId });
            return org as IOrganizationDoc;
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While deleting Certificate");
        }
    }
}
