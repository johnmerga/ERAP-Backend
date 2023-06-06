import { Schema, model } from "mongoose";
import { INotification, NotificationModel } from "./notification.model";
import { toJSON, paginate } from "../../utils";
import { NOTIFICATION_TYPE } from "./notification.type";

export const NotificationSchema = new Schema<INotification, NotificationModel>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(NOTIFICATION_TYPE),
  },
  read: {
    type: Boolean,
    default: false,
  },
  new: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

NotificationSchema.plugin(toJSON);
NotificationSchema.plugin(paginate);

export const Notification = model<INotification, NotificationModel>(
  "Notification",
  NotificationSchema
);
