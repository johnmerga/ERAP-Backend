import { Router } from "express";
import { NotificationController } from "../controller";
import { validate } from "../validator/custom";
import { notificationValidator } from "../validator";

export class NotificationRouter {
  public router: Router;
  private notificationController: NotificationController;

  constructor() {
    this.router = Router();
    this.notificationController = new NotificationController();
    this.routes();
  }

  public routes(): Router {
    // create notification
    this.router
      .route("/")
      .post(
        validate(notificationValidator.createNotification),
        this.notificationController.createNotification
      );
    // get notifications
    this.router
      .route("/")
      .get(
        validate(notificationValidator.getNotifications),
        this.notificationController.getNotifications
      );
    // get notification by id
    this.router
      .route("/:notificationId")
      .get(
        validate(notificationValidator.getNotification),
        this.notificationController.getNotification
      );
    // update notification by id
    this.router
      .route("/:notificationId")
      .patch(
        validate(notificationValidator.updateNotification),
        this.notificationController.updateNotification
      );
    return this.router;
  }
}
