import httpStatus from "http-status";
import { NotificationDal } from "../dal/notification.dal";
import { ApiError } from "../errors";
import {
  Notification,
  INotificationDoc,
  NewNotification,
  UpdateNotificationBody,
} from "../model/notification";
import { IOptions, QueryResult } from "../utils";

export class NotificationService {
  private notificationDal: NotificationDal;
  constructor() {
    this.notificationDal = new NotificationDal();
  }
  async createNotification(
    notification: NewNotification
  ): Promise<INotificationDoc> {
    return await this.notificationDal.create(notification);
  }
  async getNotification(notificationId: string): Promise<INotificationDoc> {
    try {
      return await this.notificationDal.getNotification(notificationId);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `system error: error occured while getting a notification with id: [${notificationId}] `
      );
    }
  }
  /* Query for notifications */
  public async queryNotifications(
    filter: Record<string, any>,
    options: IOptions
  ): Promise<QueryResult> {
    const notifications = await Notification.paginate(filter, options);
    return notifications;
  }
  async updateNotification(notificationId: string, update: UpdateNotificationBody): Promise<INotificationDoc> {
    return await this.notificationDal.updateNotification(notificationId, update)
}
}
