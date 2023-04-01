import mongoose, { Model, Document } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    roles: [string];
    permissions: [mongoose.Types.ObjectId];
    orgId: mongoose.Types.ObjectId
    isVerified: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserDoc extends IUser, Document { }

export type NewUser = Omit<IUser, 'isVerified' | 'status' | 'orgId'>

export type UpdateUserBody = Partial<IUser>

export interface UserModel extends Model<IUserDoc> {
    isEmailTaken(email: string): Promise<boolean>;
}

