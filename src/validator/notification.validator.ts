import joi from "joi";
import Joi from 'joi';
import { capitalizeFirstLetter, objectId } from './custom';
import { NewNotificationInputValidator, NOTIFICATION_TYPE } from "../model/notification";

// notification validation
const notificationBody: Record<keyof NewNotificationInputValidator, any> = {
    userId: joi.custom(objectId),
    title: joi.string().lowercase().custom(capitalizeFirstLetter).trim(),
    text: joi.string(),
    type: joi.string().valid(...Object.values(NOTIFICATION_TYPE)).insensitive().trim(),
}

const { ...otherNotificationBody } = notificationBody

export const createNotification = {
    body: joi.object().keys(notificationBody).options({ presence: 'required' })
}

export const getNotifications = {
    query: Joi.object().keys({
        userId: notificationBody.userId,
        title: notificationBody.title,
        type: notificationBody.type,
        read: joi.boolean(),
        limit: Joi.number().integer(),
    })
}

export const getNotification = {
    params: Joi.object().keys({
        notificationId: Joi.string().custom(objectId),
    }),
};

export const updateNotification = {
    params: Joi.object().keys({
        notificationId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            ...otherNotificationBody,
            read: joi.boolean(),
        })
        .min(1),
};