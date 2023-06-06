import { Model, Document } from "mongoose";
import { Role } from "../user";
import { QueryResult } from "../../utils";


export interface IPermission {
    name: string;
    description: string;
}

export interface IPermissionDoc extends IPermission, Document {

}

export interface IPermissionModel extends Model<IPermissionDoc> {
    isNameTaken(name: string): Promise<boolean>;
    paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type PermissionListGetter = {
    role: Role
}
export type PermissionListBasicInfo = IPermission & {
    id: string;
}