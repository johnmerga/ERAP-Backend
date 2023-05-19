import mongoose, { Model, Document } from "mongoose";
import { QueryResult } from "../../utils";
import { AccessAndRefreshTokens } from "../token";

export interface IUser {
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    roles: string[];
    permissions: mongoose.Types.ObjectId[];
    orgId: mongoose.Types.ObjectId
    isVerified: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserDoc extends IUser, Document {
    isPasswordMatch(password: string): Promise<boolean>;
}

export type NewUser = Omit<IUser, 'isVerified' | 'status' | 'createdAt' | 'updatedAt' | 'permissions'>
export type NewUserValidation = Omit<NewUser,'orgId'>
export type NewAdmin = Omit<IUser, 'roles' | 'isVerified' | 'status' | 'orgId' | 'createdAt' | 'updatedAt' | 'permissions'>

export type UpdateUserBody = Partial<IUser>

export interface UserModel extends Model<IUserDoc> {
    isEmailTaken(email: string): Promise<boolean>;
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export interface IUserWithTokens {
    user: IUserDoc;
    tokens: AccessAndRefreshTokens;
}
