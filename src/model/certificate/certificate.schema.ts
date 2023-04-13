import { Schema, model } from 'mongoose';
import { ICertificate, CertificateModel } from './certificate.model';
import { toJSON } from '../../utils';

export const CertificateSchema = new Schema<ICertificate, CertificateModel>({
    name: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    certNumber: {
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
CertificateSchema.plugin(toJSON);

export const Certificate = model<ICertificate, CertificateModel>('Certificate', CertificateSchema);