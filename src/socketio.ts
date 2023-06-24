import { Server, Socket } from "socket.io";
import { NotificationService } from "./service";
import {
    createNotification,
    updateNotification,
    getNotification,
} from "./validator/notification.validator";
import { NewNotification, UpdateNotificationBody } from "./model/notification";
import { Logger } from "./logger";
import { ApiError } from "./errors";
import httpStatus from "http-status";

export default function socketIo(io: Server) {
    let orgsIo = new Map<string, Socket>();
    io.on("connection", (socket: Socket) => {
        socket.on("setOrgId", async (orgId: string) => {
            try {
                const { error } = getNotification.params.validate({ notificationId: orgId })
                if (error) {
                    return socket.disconnect();
                }
                orgsIo.set(orgId, socket);
                Logger.info(`⚡ Socket: Organization with id ${orgId} connected`);
                return socket.emit("connected", true);
            } catch (error) {
                if (error instanceof ApiError) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Internal server error: ${error.message}`)
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Internal server error: ${error}`)
            }
        });
        socket.on("createNotification", async (not: NewNotification) => {
            const invalidNot = createNotification.body.validate(not).error;
            if (!invalidNot) {
                const notificationService = new NotificationService();
                await notificationService.createNotification(not);
                const notifications = await notificationService.queryNotifications(
                    { orgId: not.orgId, new: true },
                    {}
                );
                if (not.orgId) {
                    orgsIo
                        .get(not.orgId.toString())
                        ?.emit("notificationsLength", notifications.totalResults || 0);
                }

                // orgsIo.receiverId?.emit(
                //     "notificationsLength",
                //     notifications.totalResults || 0
                // );
            }
        });

        socket.on(
            "updateNotification",
            async (notId: string, not: UpdateNotificationBody) => {
                const invalidNot = updateNotification.body.validate(not).error;
                const invalidId = getNotification.params.validate({
                    notificationId: notId,
                }).error;
                if (!invalidNot && !invalidId) {
                    const notificationService = new NotificationService();
                    await notificationService.updateNotification(notId, not);
                    const notifications = await notificationService.queryNotifications(
                        { orgId: not.orgId },
                        {}
                    );
                    if (not.orgId) {
                        orgsIo
                            .get(not.orgId?.toString())
                            ?.emit("notificationsLength", notifications.totalResults || 0);
                    }
                }
            }
        );

        socket.on("getNotificationsLength", async (orgId) => {
            const notificationService = new NotificationService();
            const notifications = await notificationService.queryNotifications(
                { orgId: orgId, new: true },
                {}
            );
            orgsIo
                .get(orgId)
                ?.emit("notificationsLength", notifications.totalResults || 0);
        });

        socket.on("disconnect", (orgId) => {
            Logger.warn(`organization with id ${orgId} disconnected from socket`);
            orgsIo.delete(orgId);
        });
    });
}