import { Server, Socket } from "socket.io";
import { UserService } from "./service/user.service";
import { NotificationService } from "./service";
import { getUser } from "./validator/user.validator";
import { createNotification } from "./validator/notification.validator";
import { NewNotification } from "./model/notification";
import { Logger } from "./logger";

type UserIo = {
  userId: Socket | null;
};

let usersio: UserIo = { userId: null };

export default function socketIo(io: Server) {
  io.on("connection", (socket: Socket) => {
    const userService = new UserService();
    socket.on("setUserId", async (userId: string) => {
      const invalidId = getUser.params.validate({ userId: userId }).error;
      if (userId && !invalidId) {
        const user = await userService.findUserById(userId);
        if (user) {
          usersio.userId = socket;
          Logger.info(`⚡ Socket: User with id ${userId} connected`);
        } else {
          Logger.error(`🚩 Socket: No user with id ${userId}`);
        }
      }
    });

    socket.on("createNotification", async (not: NewNotification) => {
      const invalidNot = createNotification.body.validate(not).error;
      if (!invalidNot) {
        const notificationService = new NotificationService();
        await notificationService.createNotification(not);
        const notifications = await notificationService.queryNotifications(
          { userId: not.userId },
          {}
        );
        usersio.userId?.emit(
          "notificationsLength",
          notifications.totalResults || 0
        );
      }
    });

    socket.on("getNotificationsLength", async (userId) => {
      const notificationService = new NotificationService();
      const notifications = await notificationService.queryNotifications(
        { userId: userId, new: true },
        {}
      );
      usersio.userId?.emit(
        "notificationsLength",
        notifications.totalResults || 0
      );
    });

    socket.on("disconnect", (userId) => {
      Logger.info(`🔥 user with id ${userId} disconnected from socket`);
      usersio.userId = null;
    });
  });
}
