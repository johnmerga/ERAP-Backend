import { Chat, NewChat, UpdateChatBody, IChatDoc } from "../model/chat";
import { ApiError } from "../errors";
import httpStatus from "http-status";
import { Operation, updateSubDocuments } from "../utils";


export class ChatDal {
    async create(chat: NewChat): Promise<IChatDoc> {
        try {
            const newChat = await new Chat(chat).save()
            return newChat
        } catch (error) {
            throw new Error('error occurred while creating chat ')
        }
    }

    async getChat(id: string): Promise<IChatDoc> {
        try {
            const chat = await Chat.findById(id);
            if (!chat) {
                throw new ApiError(httpStatus.NOT_FOUND, 'Chat not found')
            }
            return chat;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while fetching chat')

        }
    }

    async getChats(): Promise<IChatDoc[]> {
        try {
            const chats = await Chat.find()
            return chats
        } catch (error) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while fetching chats')
        }
    }

    async updateChat(chatId: string, update: UpdateChatBody, chatMessageOperation?: Operation): Promise<IChatDoc> {
        try {

            const { messages, ...otherMessages } = update
            if (otherMessages && (!messages || !messages[0])) {
                const chat = await this.getChat(chatId)
                await chat.set(messages).save()
                return chat
            }

            if (messages && messages.length > 0) {
                const subDocUpdates = messages.map(({ id, ...otherChatMessages }) => ({
                    id,
                    update: {
                        _id: id,
                        ...otherChatMessages
                    }
                }))
                const isSubDocSaved = await updateSubDocuments(Chat, chatId, 'messages', subDocUpdates, chatMessageOperation ?? Operation.UPDATE)
                if (isSubDocSaved instanceof Error) {
                    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, isSubDocSaved.message)
                }
                return isSubDocSaved
            }
            throw new ApiError(httpStatus.BAD_REQUEST, 'chat not updated: unhanded error')

        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'system error: something went wrong while updating chat')

        }
    }

    async deleteChat(id: string): Promise<IChatDoc> {
        try {
            const chat = await Chat.findByIdAndDelete(id)
            if (!chat) {
                throw new ApiError(httpStatus.NOT_FOUND, 'the chat you are trying to delete does not exist or may have already')
            }
            return chat
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'something went wrong while deleting chat')
        }
    }
}