import mongoose from "mongoose";
import { UpdateOrgBody, Organization, IOrganizationDoc, NewOrg, } from "../model/organization";
import { ApiError } from "../errors";
import httpStatus from "http-status";
import { Operation, updateSubDocuments } from "../utils";
import { ILicense } from "../model/license";
import { IAddress } from "../model/address";

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
    async getOneOrg(orgId: string): Promise<IOrganizationDoc> {
        try {
            const org = await Organization.findById(orgId)
            if (!org) throw new ApiError(httpStatus.NOT_FOUND, `organization not found with id : [${orgId}]`)
            return org
        } catch (error) {
            if (error instanceof ApiError) throw error
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `system error: error occured while getting an Organization`)
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

    async updateOrg(orgId: string, update: UpdateOrgBody, subDocOperation?: Operation): Promise<IOrganizationDoc> {
        try {
            const { license, certificates, address, ...otherOrgFields } = update
            const org = await this.getOneOrg(orgId)
            const orgJson = org.toJSON()
            if (otherOrgFields && Object.keys(otherOrgFields).length > 0) {
                const otherOrgFieldsUpdate = await Organization.findByIdAndUpdate(
                    orgId,
                    otherOrgFields,
                )
                if (!otherOrgFieldsUpdate) throw new ApiError(httpStatus.NOT_ACCEPTABLE, `organization updated failed`)
                return otherOrgFields as IOrganizationDoc
            }
            if (subDocOperation) {
                if (license) {
                    const licenseUpdate: ILicense = {
                        ...orgJson.license,
                        ...license
                    }
                    Object.assign(org.license, licenseUpdate)
                    await org.save()
                    return org
                }
                if (certificates) {
                    const certificatesUpdateSchema = certificates.map(({ id, ...otherFields }) => ({
                        id,
                        update: {
                            _id: id,
                            ...otherFields
                        }
                    }))
                    const isCertificatesUpdated = await updateSubDocuments(Organization, orgId, 'certificates', certificatesUpdateSchema, subDocOperation)
                    if (isCertificatesUpdated instanceof Error) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, isCertificatesUpdated.message)
                    return isCertificatesUpdated
                }
                if (address) {
                    const addressUpdate: IAddress = {
                        ...orgJson.address,
                        ...address
                    }
                    Object.assign(org.address, addressUpdate)
                    await org.save()
                    return org
                }
            }
            throw new ApiError(httpStatus.NOT_IMPLEMENTED, "organization update failed: unhandled error happened");

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
}
