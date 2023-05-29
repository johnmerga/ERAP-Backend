import { FormService } from "../../service";
import { faker } from "@faker-js/faker";
import { NewForm, FormQuestionType, FormType } from "../../model/form";
import * as db from "../connect";
import mongoose from "mongoose";


const main = async () => {
    db.connect()
    const formService = new FormService()
    const forms: NewForm[] = []
    for (let i = 0; i < 15; i++) {
        const form = {
            // generate mongo id
            tenderId: new mongoose.Types.ObjectId(),
            title: faker.company.name(),
            description: faker.lorem.sentence(),
            type: FormType.FINANCIAL,
            fields: [
                {
                    question: faker.random.word(),
                    type: FormQuestionType.TEXT,
                    required: true
                },
                {
                    question: faker.random.word(),
                    type: FormQuestionType.FILE,
                    required: true
                }
            ]

        }
        forms.push(form as NewForm)
    }
    try {
        forms.forEach(async form => {
            await formService.createForm(form)
        })
    } catch (error) {
        console.log(error)
    }
    console.log('done generating forms')
    
    // const form1 = Form.create({
    //     bidId: "60f1f1f1f1f1f1f1f1f1f1f1",
    //     title: "Form 1",
    //     description: "Form 1 description",
    //     type: FormType.FINANCIAL,
    //     fields: [
    //         {
    //             question: "Question 1",
    //             type: FormQuestionType.TEXT,
    //             required: true
    //         },]
    // })
    // await form1.save()
    // console.log(form1)
}

main()