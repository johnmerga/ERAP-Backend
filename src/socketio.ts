import { Server, Socket } from "socket.io";
import { UserService } from "./service/user.service";
import { NotificationService } from "./service";
import {getUser} from "./validator/user.validator"
import { NOTIFICATION_TYPE, NewNotification } from "./model/notification";

type UserIo = {
  userId: Socket | null;
}

let usersio: UserIo = { userId : null};

export default function socketIo(io: Server) {
  io.on("connection", (socket: Socket) => {
    const userService = new UserService();
    socket.on("setUserId", async (userId: string) => {
      console.log("setting user id",userId)
      const invalidId = getUser.params.validate({userId:userId}).error
      if (userId && !invalidId) {
        const user = await userService.findUserById(userId);
        if (user) {
          usersio.userId = socket;
          console.log(`⚡ Socket: User with id ${userId} connected`);
        } else {
          console.log(`🚩 Socket: No user with id ${userId}`);
        }
      }
    });

    socket.on("createNotification", async (userId) => {
      console.log("creating a new notification")
      const invalidId = getUser.params.validate({userId:userId}).error
      console.log("invalidId",invalidId)
      if (!invalidId) {
        const notificationService = new NotificationService();
        let not: NewNotification = {
          userId: userId, title: "wow title", text: "text", type: NOTIFICATION_TYPE.TENDER_INVITE,
          read: false
        }
        await notificationService.createNotification(not)
        const notifications = await notificationService.queryNotifications({userId: userId},{})
        console.log(notifications.totalResults)
        usersio.userId?.emit("notificationsLength", notifications.totalResults || 0);
      }
      
    });

    socket.on("getNotificationsLength", async (userId) => {
      console.log("gtting notification length")
      const notificationService = new NotificationService();
      const notifications = await notificationService.queryNotifications({userId: userId},{})
      usersio.userId?.emit("notificationsLength", notifications.totalResults || 0);
    });

    socket.on("disconnect", (userId) => {
      console.log(`🔥 user with id ${userId} disconnected from socket`);
      usersio.userId = null;
    });
  });
}
