import {
  Notification,
  NewNotification,
  INotificationDoc,
  UpdateNotificationBody,
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

  async getNotifications(): Promise<INotificationDoc[]> {
    try {
      const notifications = await Notification.find();
      return notifications;
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "something went wrong while fetching notifications"
      );
    }
  }

  async updateNotification(
    notificationId: string,
    update: UpdateNotificationBody
  ): Promise<INotificationDoc> {
    try {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "There's no notification found to update"
        );
      }
      notification.set(update);
      return notification.save();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "system error: something went wrong while updating notification"
      );
    }
  }
}
