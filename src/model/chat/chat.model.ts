import mongoose, { Model, Document } from "mongoose";
import { CHAT_TYPE } from "./chat.types";

export interface IChatMessages {
  id: string;
  message: string;
  senderOrgId: mongoose.Types.ObjectId;
}

export interface IChatMessagesDoc extends IChatMessages, Document {
  id: string;
}

export interface IChatMessagesModel extends Model<IChatMessagesDoc> {}

export interface IChat {
  buyerOrgId: mongoose.Types.ObjectId;
  supplierOrgId: mongoose.Types.ObjectId;
  tenderId: mongoose.Types.ObjectId;
  type: CHAT_TYPE;
  subject: string;
  messages: IChatMessages[];
  new: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatDoc extends IChat, Document {}
export type NewChat = Omit<IChat, "createdAt" | "updatedAt">;
export type NewChatInputValidator = Omit<NewChat, 'new'>;
export type NewChatMessages = Omit<IChatMessages, "id">;
export type UpdateChatBody = Partial<IChat>;

export interface IChatModel extends Model<IChatDoc> {
  paginate: (filter: any, options: any) => Promise<any>;
}
