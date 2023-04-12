import { Schema, model } from 'mongoose';
import { IAddress, AddressModel } from './address.model';
import { toJSON } from '../../utils';

export const AddressSchema = new Schema<IAddress, AddressModel>({
    city: {
        type: String,
        required: true,
    },
    woreda: {
        type: String,
    },
    subcity: {
        type: String,
        required: true,
    },
    telephoneNum: {
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
    }
})

// Remove : not sure if we need this
AddressSchema.plugin(toJSON);

export const Address = model<IAddress, AddressModel>('Address', AddressSchema);