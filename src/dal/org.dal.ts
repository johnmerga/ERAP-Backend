import mongoose, { HydratedDocument } from "mongoose";

import { UpdateOrgBody, Organization, IOrganizationDoc, OrganizationModel } from "../model/organization";
import { ApiError } from "../errors"
import httpStatus from "http-status";


export class OrgDal {

    async create(org: OrganizationModel): Promise<HydratedDocument<IOrganizationDoc>> {

        const newOrg = new Organization(org).save()
            .then(function (org) {
                return org
            })
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "Error Happened While creating Organization");

            })



        return (await newOrg).save();
    }

    async findOrg(query: Record<string, unknown>): Promise<IOrganizationDoc> {

        const org = Organization.findOne(query)
            .then(function (org) {

                return org as IOrganizationDoc
            }
            )
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "Organization not found");

            }
            )
        return org;
    }
    async findOrgs(query: Record<string, unknown>): Promise<IOrganizationDoc[]> {

        const orgs = Organization.find(query)
            .then(function (orgs) {

                return orgs as IOrganizationDoc[]
            }
            )
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "Organizations not found");

            }
            )
        return orgs;
    }
    async updateOrg(id: mongoose.Types.ObjectId, update: UpdateOrgBody): Promise<IOrganizationDoc> {
        const org = Organization.findOne({ _id: id })
            .then(function (org) {
                if (org) {
                    org.set(update)
                    org.save()
                    return org
                }
                else {
                    throw new ApiError(httpStatus.BAD_REQUEST, "Organization not found");
                }
            })
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "error while updating organization");

            }
            )
        return org;
    }

}
