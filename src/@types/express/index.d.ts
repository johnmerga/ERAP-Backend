import express from "express"
import { IUserDoc } from "../../model/user"


declare global {
    namespace Express {
      interface Request {
        user?: IUserDoc,
        token?: string,
        permissions?: string[]
      }
    }
  }