import joi from "joi";
import { objectId } from "./custom";
import {
  NewChatInputValidator,
  CHAT_TYPE,
  NewChatMessages,
} from "../model/chat";

// a single message validation
const chatMessageBody: Record<keyof NewChatMessages, any> = {
  message: joi.string().trim(),
  senderOrgId: joi
    .string()
    .custom(objectId)
    .trim(),
};

// chat validation
const chatBody: Record<keyof NewChatInputValidator, any> = {
  buyerOrgId: joi
    .string()
    .custom(objectId)
    .trim(),
  supplierOrgId: joi
    .string()
    .custom(objectId)
    .trim(),
  tenderId: joi
    .string()
    .custom(objectId)
    .trim(),
  type: joi
    .string()
    .valid(...Object.values(CHAT_TYPE))
    .insensitive(),
  subject: joi.string().trim(),
  messages: joi.array().items(chatMessageBody),
};

const { messages, ...otherChatBody } = chatBody;
const { ...otherChatMessageBody } = chatMessageBody;

export const createChat = {
  body: joi
    .object()
    .keys({
      ...otherChatBody,
      messages: joi
        .array()
        .items(
          joi
            .object()
            .keys(otherChatMessageBody)
            .options({ presence: "required" })
        )
        .required(),
    })
    .options({ presence: "required" }),
};

export const getChat = {
  params: joi.object().keys({
    chatId: joi.string().custom(objectId),
  }),
};

export const getChats = {
  query: joi.object().keys({
    tenderId: joi
      .string()
      .custom(objectId)
      .trim(),
    buyerOrgId: joi
      .string()
      .custom(objectId)
      .trim(),
    supplierOrgId: joi
      .string()
      .custom(objectId)
      .trim(),
    type: joi
      .string()
      .valid(...Object.values(CHAT_TYPE))
      .insensitive(),
    page: joi.number().min(1),
    limit: joi.number().min(1),
    sortBy: joi.string(),
    projectBy: joi.string(),
    populate: joi.string(),
  }),
};
export const updateChat = {
  params: joi.object().keys({
    chatId: joi.string().custom(objectId),
  }),
  body: joi
    .object()
    .keys({ ...otherChatBody, new: joi.boolean() })
    .min(1),
};

export const deleteChat = {
  params: joi.object().keys({
    chatId: joi.string().custom(objectId),
  }),
};

/**
 * ----------------------------------------------------------------------------------------------------
 * only chat messages validation
 *  ----------------------------------------------------------------------------------------------------
 */
export const addChatMessages = {
  params: joi.object().keys({
    chatId: joi.string().custom(objectId),
  }),
  body: joi.object().keys({
    messages: joi
      .array()
      .items(
        joi
          .object()
          .keys(otherChatMessageBody)
          .options({ presence: "required" })
      )
      .required(),
  }),
};

export const updateChatMessages = {
  params: joi.object().keys({
    chatId: joi.string().custom(objectId),
  }),
  body: joi.object().keys({
    messages: joi
      .array()
      .items(
        joi
          .object()
          .keys({
            ...otherChatMessageBody,
            id: joi
              .string()
              .custom(objectId)
              .trim()
              .required(),
          })
          .options({ presence: "required" })
      )
      .required(),
  }),
};
