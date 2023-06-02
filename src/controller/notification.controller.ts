import { NextFunction, Request, Response } from "express";
import { NotificationService } from "../service";
import { catchAsync, pick } from "../utils";
import httpStatus from "http-status";

export class NotificationController {
  private notificationService: NotificationService;
  constructor() {
    this.notificationService = new NotificationService();
  }
  createNotification = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const notification = await this.notificationService.createNotification(
        req.body
      );
      res.status(httpStatus.CREATED).send(notification);
    }
  );
  getNotification = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const notification = await this.notificationService.getNotification(
        req.params.notificationId
      );
      res.status(httpStatus.OK).send(notification);
    }
  );
  getNotifications = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const filter = pick(req.query, ["userId","type","title","read"]);
      const options = pick(req.query, ["sortBy", "limit", "page", "populate"]);
      const result = await this.notificationService.queryNotifications(filter, options);
      res.status(httpStatus.OK).send(result);
    }
  );
  public updateNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.params.notificationId === 'string') {
        const notification = await this.notificationService.updateNotification(req.params.notificationId, req.body);
        res.send(notification);
    }
});
}
