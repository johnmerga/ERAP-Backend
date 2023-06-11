import { Server, Socket } from "socket.io";
import { OrgService } from "./service/org.service";
import { NotificationService } from "./service";
import { getOrg } from "./validator/org.validator";
import {
    createNotification,
    updateNotification,
    getNotification,
} from "./validator/notification.validator";
import { NewNotification, UpdateNotificationBody } from "./model/notification";
import { Logger } from "./logger";
import { ApiError } from "./errors";
import httpStatus from "http-status";

type OrgIo = {
    orgId: Socket | null;
};

let orgsIo: OrgIo = { orgId: null };

export default function socketIo(io: Server) {
    io.on("connection", (socket: Socket) => {
        const orgService = new OrgService();
        socket.on("setOrgId", async (orgId: string) => {
            try {
                const { error } = getOrg.params.validate({ orgId: orgId })
                if (error) throw new ApiError(httpStatus.BAD_REQUEST, error.message)
                await orgService.findOrgById(orgId);
                orgsIo.orgId = socket;
                Logger.info(`⚡ Socket: Organization with id ${orgId} connected`);
            } catch (error) {
                if (error instanceof ApiError) throw error
                throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `system error: error occured while creating connection to socket`)
            }
        })
        socket.on("createNotification", async (not: NewNotification) => {
            const invalidNot = createNotification.body.validate(not).error;
            if (!invalidNot) {
                const notificationService = new NotificationService();
                await notificationService.createNotification(not);
                const notifications = await notificationService.queryNotifications(
                    { orgId: not.orgId },
                    {}
                );
                orgsIo.orgId?.emit(
                    "notificationsLength",
                    notifications.totalResults || 0
                );
            }
        })

        socket.on(
            "updateNotification",
            async (notId: string, not: UpdateNotificationBody) => {
                const invalidNot = updateNotification.body.validate(not).error;
                const invalidId = getNotification.params.validate({ notificationId: notId })
                    .error;
                if (!invalidNot && !invalidId) {
                    const notificationService = new NotificationService();
                    await notificationService.updateNotification(notId, not);
                    const notifications = await notificationService.queryNotifications(
                        { orgId: not.orgId },
                        {}
                    );
                    orgsIo.orgId?.emit(
                        "notificationsLength",
                        notifications.totalResults || 0
                    );
                }
            }
        );

        socket.on("getNotificationsLength", async (orgId) => {
            const notificationService = new NotificationService();
            const notifications = await notificationService.queryNotifications(
                { orgId: orgId, new: true },
                {}
            );
            orgsIo.orgId?.emit(
                "notificationsLength",
                notifications.totalResults || 0
            );
        });

        socket.on("disconnect", (orgId) => {
            Logger.info(`🔥 organization with id ${orgId} disconnected from socket`);
            orgsIo.orgId = null;
        });
    });
}