import mongoose, { Model, Document } from "mongoose";
import { NOTIFICATION_TYPE } from './notification.type'

export interface INotification {
    userId: mongoose.Types.ObjectId,
    title: string,
    type: NOTIFICATION_TYPE,
    read: boolean,
    createdAt: Date;
    updatedAt: Date;
}

export interface INotificationDoc extends INotification, Document {
}

export type NewNotification = Omit<INotification, 'createdAt' | 'updatedAt'>

export interface NotificationModel extends Model<INotificationDoc> {
}
