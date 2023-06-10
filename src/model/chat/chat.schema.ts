import { Schema, model } from "mongoose";
import {
  IChatDoc,
  IChatMessagesDoc,
  IChatMessagesModel,
  IChatModel,
} from "./chat.model";
import { paginate, toJSON } from "../../utils";
import { CHAT_TYPE } from "./chat.types";

const chatMessageSchema = new Schema<IChatMessagesDoc, IChatMessagesModel>({
  message: {
    type: String,
    required: true,
  },
  senderOrgId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
});

const chatSchema = new Schema<IChatDoc, IChatModel>({
  buyerOrgId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  supplierOrgId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  tenderId: {
    type: Schema.Types.ObjectId,
    ref: "Tender",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(CHAT_TYPE),
  },
  subject: {
    type: String,
    required: true
  },
  messages: [chatMessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

chatMessageSchema.plugin(toJSON);
chatSchema.plugin(toJSON);
chatSchema.plugin(paginate);

export const ChatMessages = model<IChatMessagesDoc, IChatMessagesModel>("ChatMessages", chatMessageSchema);
export const Chat = model<IChatDoc, IChatModel>("Chat", chatSchema);