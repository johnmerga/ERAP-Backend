import { Request, Response } from "express"


export class Auth {

    public static registerUser(req: Request, res: Response) {

        res.status(201).send("check successful")
    }

    public static loginUser(req: Request, res: Response) {
        res.status(200).send("check succeed")

    }
    public static logoutUser(req: Request, res: Response) {

    }

}