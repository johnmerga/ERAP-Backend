import mongoose, { HydratedDocument } from "mongoose";

import {
  UpdateOrgBody,
  Organization,
  IOrganizationDoc,
  NewOrg,
} from "../model/organization";
import { ApiError } from "../errors";
import httpStatus from "http-status";
import { Certificate, NewCertificate } from "../model/certificate";

export class OrgDal {
  async create(org: NewOrg): Promise<HydratedDocument<IOrganizationDoc>> {
    try {
      const newOrg = new Organization(org);
      return await newOrg.save();
    } catch (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Error Happened While creating Organization"
      );
    }
  }

  async findOrg(query: Record<string, unknown>): Promise<IOrganizationDoc> {
    try {
      const org = await Organization.findOne(query);
      if (!org)
        throw new ApiError(httpStatus.BAD_REQUEST, "Organization not found");
      return org as IOrganizationDoc;
    } catch (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Error occured while finding organization"
      );
    }
  }

  async findOrgs(query: Record<string, unknown>): Promise<IOrganizationDoc[]> {
    try {
      const orgs = await Organization.find(query);
      if (!orgs)
        throw new ApiError(httpStatus.BAD_REQUEST, "No organizations found");
      return orgs as IOrganizationDoc[];
    } catch (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Error occured while finding organizations"
      );
    }
  }

  async updateOrg(
    id: mongoose.Types.ObjectId,
    update: UpdateOrgBody
  ): Promise<IOrganizationDoc> {
    try {
      const org = await Organization.findOne({ _id: id });
      if (org) {
        org.set(update);
        org.save();
        return org;
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, "Organization not found");
      }
    } catch (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Error while updating organization."
      );
    }
  }

  async addCertificate(
    id: mongoose.Types.ObjectId,
    certBody: NewCertificate
  ): Promise<IOrganizationDoc> {
    try {
      const org = await Organization.findOne({ _id: id });
      // const org = await Organization.updateOne({_id:id},{$push: {certificates: certBody}})
      if (org) {
        const newCertificate = new Certificate(certBody);
        org.certificates.push(newCertificate);
        org.save();
        return org;
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, "Organization not found");
      }
    } catch (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Error while adding certificate."
      );
    }
  }

  async removeCertificate(orgId: mongoose.Types.ObjectId, certId: mongoose.Types.ObjectId) : Promise<IOrganizationDoc> {
    try {
      let org = await Organization.findOne({ _id: orgId });
      if (org) {
        await Organization.updateOne({_id: orgId},{$pull: {certificates: {_id:certId}}})
        org = await Organization.findOne({ _id: orgId });
        return org as IOrganizationDoc;
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, "Organization not found");
      }
    } catch (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Error while removing certificate."
      );
    }
  }
}
