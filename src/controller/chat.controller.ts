import { NextFunction, Request, Response } from "express";
import { ChatService } from "../service";
import { catchAsync, pick } from "../utils";
import httpStatus from "http-status";
import { ApiError } from "../errors";

export class ChatController {
  private chatService: ChatService;
  constructor() {
    this.chatService = new ChatService();
  }
  createChat = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // check if it has an organization id and if the user exists
      if (!req.user || !req.user.orgId)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `user does not have an organization id or user does not exist`
        );
      const chat = await this.chatService.createChat(req.body);
      res.status(httpStatus.CREATED).send(chat);
    }
  );
  getChat = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const chat = await this.chatService.getChat(req.params.chatId, req.user!);
      res.status(httpStatus.OK).send(chat);
    }
  );
  queryChats = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const filter = pick(req.query, [
        "type",
        "tenderId",
        "buyerOrgId",
        "supplierOrgId",
      ]);
      const options = pick(req.query, ["sortBy", "limit", "page", "populate"]);
      const result = await this.chatService.queryChats(filter, options);
      res.status(httpStatus.OK).send(result);
    }
  );
  updateChat = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "you have to be logged in to access this route"
        );
      const chat = await this.chatService.updateChat(
        req.params.chatId,
        req.body,
        req.user
      );
      res.status(httpStatus.OK).send(chat);
    }
  );
  deleteChat = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.chatService.deleteChat(req.params.chatId);
      res.status(httpStatus.OK).send();
    }
  );

  /**
   * ----------------------------------------------------------------------------------------------------
   * only chat messages
   * ----------------------------------------------------------------------------------------------------
   */
  addChatMessages = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user)
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "you have to be logged in to access this route"
        );
      const chat = await this.chatService.addChatMessages(
        req.params.chatId,
        req.body.messages,
      );
      res.status(httpStatus.OK).send(chat);
    }
  );

  updateChatMessages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new ApiError(httpStatus.BAD_REQUEST, 'you have to be logged in to access this route')
    const chat = await this.chatService.updateChatMessages(req.params.chatId, req.body.messages)
    res.status(httpStatus.OK).send(chat)
})
}
