import mongoose, { HydratedDocument } from "mongoose";

import { UpdateUserBody, User } from "../model/user";
import { ApiError } from "../errors"
import httpStatus from "http-status";
import { NewUser, IUserDoc } from "../model/user";


export class UserDal {

    async create(user: NewUser): Promise<HydratedDocument<IUserDoc>> {

        const newUser = new User(user).save()
            .then(function (user) {
                return user
            })
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "Error Happened While crating User");

            })


        return newUser;
    }

    async findUser(query: Record<string, unknown>): Promise<IUserDoc> {

        const user = User.findOne(query)
            .then(function (user) {

                return user as IUserDoc
            }
            )
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "User not found");

            }
            )
        return user;
    }
    async findUsers(query: Record<string, unknown>): Promise<IUserDoc[]> {

        const users = User.find(query)
            .then(function (users) {

                return users as IUserDoc[]
            }
            )
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "User not found");

            }
            )
        return users;
    }
    async updateUser(id: mongoose.Types.ObjectId, update: UpdateUserBody): Promise<IUserDoc> {
        const user = User.findOne({ _id: id })
            .then(function (user) {
                if (user) {
                    user.set(update)
                    user.save()
                    return user
                }
                else {
                    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
                }
            })
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "error while updating user");

            }
            )
        return user;
    }

    async deleteUser(id: mongoose.Types.ObjectId): Promise<IUserDoc> {
        const user = User.findOneAndDelete({ _id: id })
            .then(function (user) {
                if (user) {
                    return user
                }
                else {
                    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
                }
            }
            )
            .catch(function (err) {
                // handle error
                throw new ApiError(httpStatus.BAD_REQUEST, "error while deleting user");

            }
            )
        return user;
    }
}
