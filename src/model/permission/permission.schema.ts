import { Schema, model } from "mongoose";

import { IPermissionDoc, IPermissionModel } from "./permission.model"
import { toJSON } from "../../utils";


const PermissionSchema = new Schema<IPermissionDoc, IPermissionModel>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        // required: true,
        trim: true,
        lowercase: true
    },
});

PermissionSchema.statics.isNameTaken = async function (name: string) {
    const permission = await this.findOne({ name });
    return !!permission;
}

PermissionSchema.plugin(toJSON)


export const Permission = model<IPermissionDoc, IPermissionModel>("Permission", PermissionSchema);



