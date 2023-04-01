import { Model,Document } from "mongoose";


export interface IPermission {
    name: string;
    description: string;
}

export interface IPermissionDoc extends IPermission, Document {

}

export interface IPermissionModel extends Model<IPermissionDoc> {
    isNameTaken(name: string): Promise<boolean>;
}

