import validator from 'validator';
import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs"

import { IUser, UserModel } from '../../model/user';
import { ApiError } from '../../errors';
import httpStatus from 'http-status';

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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

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
export const User = model<IUser, UserModel>('User', UserSchema);




