import mongoose, { Model, Document } from "mongoose";
import { QueryResult } from "../../utils";
import { AccessAndRefreshTokens } from "../token";
import { USER_STATUS } from "./user.status";
import { Role } from "./user.roles";

export interface IUser {
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    roles: Role[];
    permissions: mongoose.Types.ObjectId[];
    orgId: mongoose.Types.ObjectId
    isVerified: boolean;
    status: USER_STATUS;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserDoc extends IUser, Document {
    isPasswordMatch(password: string): Promise<boolean>;
}

export type NewUserInput = Omit<IUser, 'isVerified' | 'status' | 'createdAt' | 'updatedAt'>
export type NewUserValidation = Omit<NewUserInput, 'orgId' | 'permissions'>
export type NewAdmin = Omit<IUser, 'roles' | 'isVerified' | 'status' | 'orgId' | 'createdAt' | 'updatedAt'>
export type NewAdminValidator = Omit<IUser, 'roles' | 'isVerified' | 'status' | 'orgId' | 'createdAt' | 'updatedAt' | 'permissions'>
export type NewAdminInput = Omit<IUser, | 'isVerified' | 'status' | 'orgId' | 'createdAt' | 'updatedAt'>

export type UpdateAdminBody = Partial<Omit<NewUserInput, 'orgId'>>
export type UpdateUserBodyForUser = Partial<Omit<NewUserValidation, 'roles'>>
export type UpdateUserBodyByAdmin = Partial<Pick<UpdateAdminBody, 'roles' | 'permissions'>>
export type VerifyUserAndOrgId = Partial<Pick<IUser, 'isVerified' | 'status' | 'orgId'>>

export interface UserModel extends Model<IUserDoc> {
    isEmailTaken(email: string): Promise<boolean>;
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export interface IUserWithTokens {
    user: IUserDoc;
    tokens: AccessAndRefreshTokens;
}
