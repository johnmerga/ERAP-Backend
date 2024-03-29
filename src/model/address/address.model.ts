import { Model, Document } from "mongoose";

export interface IAddress {
    city: string;
    woreda: string;
    subcity: string;
    telephoneNum: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAddressDoc extends IAddress, Document {
}
export type NewAddress = Omit<IAddress, 'createdAt' | 'updatedAt'>
export type UpdateAddressBody = Partial<Omit<IAddress, 'createdAt' | 'updatedAt'>> & {
    id: string
}

export interface AddressModel extends Model<IAddressDoc> {
}