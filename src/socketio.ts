import { Server, Socket } from "socket.io";
import { OrgService } from "./service/org.service";
import { NotificationService } from "./service";
import { getOrg } from "./validator/org.validator";
import { createNotification } from "./validator/notification.validator";
import { NewNotification } from "./model/notification";
import { Logger } from "./logger";

type OrgIo = {
  orgId: Socket | null;
};

let orgsio: OrgIo = { orgId: null };

export default function socketIo(io: Server) {
  io.on("connection", (socket: Socket) => {
    const orgService = new OrgService();
    socket.on("setOrgId", async (orgId: string) => {
      const invalidId = getOrg.params.validate({ orgId: orgId }).error;
      if (orgId && !invalidId) {
        const org = await orgService.findOrgById(orgId);
        if (org) {
          orgsio.orgId = socket;
          Logger.info(`⚡ Socket: Organization with id ${orgId} connected`);
        } else {
          Logger.error(`🚩 Socket: No organization with id ${orgId}`);
        }
      }
    });

    socket.on("createNotification", async (not: NewNotification) => {
      const invalidNot = createNotification.body.validate(not).error;
      if (!invalidNot) {
        const notificationService = new NotificationService();
        await notificationService.createNotification(not);
        const notifications = await notificationService.queryNotifications(
          { orgId: not.orgId },
          {}
        );
        orgsio.orgId?.emit(
          "notificationsLength",
          notifications.totalResults || 0
        );
      }
    });

    socket.on("getNotificationsLength", async (orgId) => {
      const notificationService = new NotificationService();
      const notifications = await notificationService.queryNotifications(
        { orgId: orgId, new: true },
        {}
      );
      orgsio.orgId?.emit(
        "notificationsLength",
        notifications.totalResults || 0
      );
    });

    socket.on("disconnect", (orgId) => {
      Logger.info(`🔥 organization with id ${orgId} disconnected from socket`);
      orgsio.orgId = null;
    });
  });
}
