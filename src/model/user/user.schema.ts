import validator from 'validator';
import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs"

import { IUser, UserModel } from '.';
import { Role } from './user.roles';
import { ApiError } from '../../errors';
import httpStatus from 'http-status';
import { USER_STATUS } from './user.status';
import { toJSON, paginate } from '../../utils'



const UserSchema = new Schema<IUser, UserModel>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value: string) {
            if (!validator.isEmail(value)) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        enum: Object.values(Role),
        default: [Role.User]
    },
    permissions: {
        type: [Schema.Types.ObjectId],
        ref: 'Permission',
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    orgId: {
        type: Schema.Types.ObjectId,
        ref: "Organization"
    },
    status: {
        type: String,
        enum: Object.values(USER_STATUS),
        default: USER_STATUS.PENDING
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

UserSchema.plugin(toJSON)
UserSchema.plugin(paginate)

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// check if the email is already in use using schema.statics
UserSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: string) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
}
// check if the password is correct using schema.methods
UserSchema.methods.isPasswordMatch = async function (password: string) {
    const user = this;
    return bcrypt.compare(password, user.password);
}


export const User = model<IUser, UserModel>('User', UserSchema);





