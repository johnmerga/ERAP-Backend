import express from "express"
import { IUserDoc } from "../../model/user"
import {IPayload  } from "../../model/token"


declare global {
    namespace Express {
      interface Request {
        user?: IUserDoc,
        token?: IPayload,
        permissions?: string[]
      }
    }
  }