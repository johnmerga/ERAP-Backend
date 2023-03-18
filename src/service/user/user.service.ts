// import { IUser, UserModel } from "../model/user"
import { User as UserSchema } from "../../schema/user"
import { UserDal } from "../../dal/user"
import httpStatus from "http-status";
import { ApiError } from "../../errors";
import { IUser } from "../../model/user";


export class UserService {
    private userDal: UserDal;
    constructor() {
        this.userDal = new UserDal();
    }

    public async isEmailTaken(email: string): Promise<boolean> {
        return UserSchema.isEmailTaken(email);
    }

    public async create(user: IUser): Promise<IUser> {
        // check if email is taken
        if (await this.isEmailTaken(user.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }
        return this.userDal.create(user);
    }


}
