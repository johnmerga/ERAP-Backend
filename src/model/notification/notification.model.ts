import mongoose, { Model, Document } from "mongoose";
import { QueryResult } from "../../utils";
import { NOTIFICATION_TYPE } from "./notification.type";

export interface INotification {
  userId: mongoose.Types.ObjectId;
  title: string;
  text: string;
  type: NOTIFICATION_TYPE;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationDoc extends INotification, Document {}

export type NewNotification = Omit<INotification, "createdAt" | "updatedAt">;
export type NewNotificationInputValidator = Omit<NewNotification, 'read'>;
export type UpdateNotificationBody = Partial<INotification>;

export interface NotificationModel extends Model<INotificationDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}
