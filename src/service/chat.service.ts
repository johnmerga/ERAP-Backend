import httpStatus from "http-status";
import { ChatDal } from "../dal/chat.dal";
import { ApiError } from "../errors";
import {
  Chat,
  IChatDoc,
  IChatMessages,
  NewChat,
  NewChatMessages,
  UpdateChatBody,
} from "../model/chat";
import { IUserDoc } from "../model/user";
import { IOptions, QueryResult, Operation, checkIdsInSubDocs } from "../utils";

export class ChatService {
  private chatDal: ChatDal;

  constructor() {
    this.chatDal = new ChatDal();
  }
  async createChat(chat: NewChat): Promise<IChatDoc> {
    return await this.chatDal.create(chat);
  }
  async getChat(chatId: string, user: IUserDoc): Promise<IChatDoc> {
    try {
      const chat = await this.chatDal.getChat(chatId);
      // checking pre condition
      if (!user.orgId)
        throw new ApiError(
          httpStatus.FAILED_DEPENDENCY,
          `no organization id associated with this user id : [${user.id}]`
        );
      if (!chat.tenderId)
        throw new ApiError(
          httpStatus.PRECONDITION_FAILED,
          `couldn't process chat as it's not linked to any tender`
        );
      return await this.chatDal.getChat(chatId);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `system error: error occured while getting a chat with id: [${chatId}] `
      );
    }
  }
  async queryChats(
    filter: Record<string, any>,
    options: IOptions
  ): Promise<QueryResult> {
    try {
      return await Chat.paginate(filter, options);
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Error Happened While querying Chats"
      );
    }
  }

  async updateChat(
    chatId: string,
    update: UpdateChatBody,
    user: IUserDoc
  ): Promise<IChatDoc> {
    try {
      // auth check
      const chat = await (await this.chatDal.getChat(chatId)).populate(
        "tenderId"
      );
      if (!chat || typeof chat.tenderId === "string")
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `system error: failed to get tender id from chat`
        );
      const { messages, ...otherMessages } = update;
      if (otherMessages) {
        // Delete later : ask jo
        // if (otherMessages.tenderId)
        //     await this.tenderService.getTenderById((otherFields.tenderId).toString(), user)
        return await this.chatDal.updateChat(chatId, otherMessages);
      }
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "chat update failed: unhandled chat service error"
      );
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "system error: failed to update chat"
      );
    }
  } /* Add new chat message to chat */

  /**
   * ----------------------------------------------------------------------------------------------------
   * only chat messages
   * ----------------------------------------------------------------------------------------------------
   */ async addChatMessages(
    chatId: string,
    messages: NewChatMessages[]
  ): Promise<IChatDoc> {
    try {
      // auth check
      const authChat = await (await this.chatDal.getChat(chatId)).populate(
        "tenderId"
      );
      if (!authChat || typeof authChat.tenderId === "string")
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `system error: failed to get tender id from chat`
        );

      const chat = await this.chatDal.updateChat(
        chatId,
        {
          messages: messages as IChatMessages[],
        },
        Operation.ADD
      );
      return chat;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "system error: failed to add chat messages"
      );
    }
  }

  async updateChatMessages(
    chatId: string,
    messages: IChatMessages[]
  ): Promise<IChatDoc> {
    try {
      // auth check
      const authChat = await (await this.chatDal.getChat(chatId)).populate(
        "tenderId"
      );
      if (!authChat || typeof authChat.tenderId === "string")
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `system error: failed to get tender id from chat`
        );

      const chatMessageIds = messages.map((message) => message.id);
      const isValidchatMessageIds = await checkIdsInSubDocs(
        Chat,
        chatId,
        "messages",
        chatMessageIds
      );
      if (isValidchatMessageIds instanceof Error)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          isValidchatMessageIds.message
        );
      const chat = await this.chatDal.updateChat(
        chatId,
        {
          messages,
        },
        Operation.UPDATE
      );
      return chat;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "system error: failed to update chat messages"
      );
    }
  }

  async deleteChat(id: string): Promise<IChatDoc> {
    return await this.chatDal.deleteChat(id);
  }
}
