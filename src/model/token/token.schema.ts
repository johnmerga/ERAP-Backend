import { Schema, model } from "mongoose"
import { ITokenDoc, ITokenModel } from "./token.model"
import { TokenType } from "./token.type"
import { toJSON } from "../../utils"

const TokenSchema = new Schema<ITokenDoc, ITokenModel>({
    token: {
        type: String,
        required: true,
        index: true,
    },
    user: {
        type: String,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: [TokenType.ACCESS, TokenType.REFRESH, TokenType.RESET_PASSWORD, TokenType.VERIFY_EMAIL],
    },
    expires: {
        type: Date,
        required: true,
    },
    blacklisted: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true,
}
)

TokenSchema.plugin(toJSON)


export const Token = model<ITokenDoc, ITokenModel>('Token', TokenSchema)
