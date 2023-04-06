import { Model, Document } from "mongoose"

export interface IOrganization {
    name: string;
    type: string;
    tinNo: string;
    captial: string;
    sector: string;
    createdAt: Date;
    updatedAt: Date;
}
