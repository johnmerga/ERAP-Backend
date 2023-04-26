import { FormDal } from "../dal/form.dal";
import { IFormDoc, NewForm } from "../model/form";
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
    async updateForm(id: string, update: any): Promise<IFormDoc> {
        return await this.formDal.updateForm(id, update)
    }
    async deleteForm(id: string): Promise<IFormDoc> {
        return await this.formDal.deleteForm(id)
    }

}