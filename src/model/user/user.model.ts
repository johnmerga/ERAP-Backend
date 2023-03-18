import { Model } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

}

export interface UserModel extends Model<IUser> {
    isEmailTaken(email: string): Promise<boolean>;
}

