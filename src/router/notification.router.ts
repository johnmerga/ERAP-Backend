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
    // create organization
    this.router
      .route("/")
      .post(
        validate(notificationValidator.createNotification),
        this.notificationController.createNotification
      );
    // get organizations
    this.router
      .route("/")
      .get(
        validate(notificationValidator.getNotifications),
        this.notificationController.getNotifications
      );
    // get organization by id
    this.router
      .route("/:notificationId")
      .get(
        validate(notificationValidator.getNotification),
        this.notificationController.getNotification
      );
    return this.router;
  }
}
