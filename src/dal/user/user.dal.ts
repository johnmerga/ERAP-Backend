import { HydratedDocument } from "mongoose";
import { IUser } from "../../model/user";
import { User } from "../../schema/user";
import { ApiError } from "../../errors"
import httpStatus from "http-status";


export class UserDal {

    async create(user: IUser): Promise<HydratedDocument<IUser>> {

        const newUser = new User(user).save()
            .then(function (user) {
                return user
            })
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, err);

            })


        return newUser;
    }
}
