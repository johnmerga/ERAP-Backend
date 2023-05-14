import httpStatus from "http-status";
import { FormDal } from "../dal/form.dal";
import { ApiError } from "../errors";
import { Form, IFormDoc, NewForm } from "../model/form";
import { IOptions, QueryResult } from "../utils";
export class FormService {
    private formDal: FormDal
    constructor() {
        this.formDal = new FormDal()
    }
    async createForm(form: NewForm): Promise<IFormDoc> {
        return await this.formDal.create(form)
    }
    async getForm(id: string): Promise<IFormDoc> {
        return await this.formDal.getForm(id)
    }
    async queryForms(filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
        try {
            return await Form.paginate(filter, options)
        } catch (error) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error Happened While querying Forms")
        }
    }

    async updateForm(id: string, update: any): Promise<IFormDoc> {
        return await this.formDal.updateForm(id, update)
    }
    async deleteForm(id: string): Promise<IFormDoc> {
        return await this.formDal.deleteForm(id)
    }

}