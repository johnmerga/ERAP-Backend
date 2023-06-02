import {
  Notification,
  NewNotification,
  INotificationDoc,
} from "../model/notification";
import { ApiError } from "../errors";
import httpStatus from "http-status";

export class NotificationDal {
  async create(notification: NewNotification): Promise<INotificationDoc> {
    try {
      const newNotification = await new Notification(notification).save();
      return newNotification;
    } catch (error) {
      throw new Error("error occurred while creating notification ");
    }
  }

  async getNotification(id: string): Promise<INotificationDoc> {
    try {
      const notification = await Notification.findById(id);
      if (!notification) {
        throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
      }
      return notification;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "something went wrong while fetching notification"
      );
    }
  }
}
