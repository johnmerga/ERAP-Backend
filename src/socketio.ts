import { Server, Socket } from "socket.io";
import { UserService } from "./service/user.service";

let usersio = [];

export default function socketIo(io: Server) {
  io.on("connection", (socket: Socket) => {
    const userService = new UserService();
    socket.on("setUserId", async (userId) => {
      if (userId) {
        const user = await userService.findUserById(userId);
        if (user) {
          usersio[userId] = socket;
          console.log(`⚡ Socket: User with id ${userId} connected`);
        } else {
          console.log(`🚩 Socket: No user with id ${userId}`);
        }
      }
    });
    socket.on("getNotificationsLength", async (userId) => {
      const notifications = await notification
        .find({ user: userId, read: false })
        .lean();
      usersio[userId]?.emit("notificationsLength", notifications.length || 0);
    });

    socket.on("disconnect", (userId) => {
      console.log(`🔥 user with id ${userId} disconnected from socket`);
      usersio[userId] = null;
    });
  });
}
