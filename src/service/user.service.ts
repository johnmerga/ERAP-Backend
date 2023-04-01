// import { IUser, UserModel } from "../model/user"
import { User, IUserDoc, NewUser, UpdateUserBody } from "../model/user"
import { UserDal } from "../dal";
import httpStatus from "http-status";
import { ApiError } from "../errors";
import { IUser } from "../model/user";
import mongoose from "mongoose";


export class UserService {
    private userDal: UserDal;
    constructor() {
        this.userDal = new UserDal();
    }
    /* check email */
    public async isEmailTaken(email: string): Promise<boolean> {
        return User.isEmailTaken(email);
    }
    /* create user */
    public async create(user: NewUser): Promise<IUserDoc> {
        // check if email is taken
        if (await this.isEmailTaken(user.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        return this.userDal.create(user);
    }
    /* get user  */
    public async findUserById(id: string): Promise<IUserDoc | null> {
        return User.findById(new mongoose.Types.ObjectId(id));
    }

    public async findUserByEmail(email: string): Promise<IUserDoc | null> {
        return User.findOne({ email });
    }

    public async findUsers(query: Record<string, unknown>): Promise<IUser[]> {
        return await this.userDal.findUsers(query);
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
        user = await new UserDal().updateUser(user._id, user)

        return user
    }

    public async deleteUserById(id: string): Promise<IUserDoc> {
        return await new UserDal().deleteUser(new mongoose.Types.ObjectId(id))
    }



}
