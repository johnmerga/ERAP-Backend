// import { IUser, UserModel } from "../model/user"
import { User, IUserDoc, NewUser, NewAdmin, UpdateUserBody } from "../model/user"
import { UserDal } from "../dal";
import httpStatus from "http-status";
import { ApiError } from "../errors";
import mongoose from "mongoose";
import { IOptions, QueryResult } from "../utils";


export class UserService {
    private userDal: UserDal;
    constructor() {
        this.userDal = new UserDal();
    }

    /* check email */
    public async isEmailTaken(email: string): Promise<boolean> {
        return User.isEmailTaken(email);
    }
    /*register admin  */
    public async registerAdmin(userBody: NewAdmin): Promise<IUserDoc> {
        // check if email is taken
        if (await this.isEmailTaken(userBody.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        Object.assign(userBody, { roles: ['admin'] })
        return this.userDal.create(userBody);
    }


    /* create user */
    public async create(userBody: NewUser): Promise<IUserDoc> {
        // check if email is taken
        if (await this.isEmailTaken(userBody.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        return this.userDal.create(userBody);
    }
    /* get user  */
    public async findUserById(id: string): Promise<IUserDoc> {
        const user = await User.findById(new mongoose.Types.ObjectId(id));
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }
        return user;
    }

    public async findUserByEmail(email: string): Promise<IUserDoc> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found')
        }
        return user;
    }
    /* Query for users */
    public async queryUsers(filter: Record<string, any>, options: IOptions): Promise<QueryResult> {

        const users = await User.paginate(filter, options)
        return users

    }

    /* update user */

    public async updateUserById(id: string, updateBody: UpdateUserBody): Promise<IUserDoc> {
        let user = await this.findUserById(id)
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
        }

        if (updateBody.email && (await User.isEmailTaken(updateBody.email))) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        Object.assign(user, updateBody)
        user = await this.userDal.updateUser(new mongoose.Types.ObjectId(id), user)
        return user
    }
    /* delete user */
    public async deleteUserById(id: string): Promise<IUserDoc> {
        return await this.userDal.deleteUser(new mongoose.Types.ObjectId(id));
    }



}