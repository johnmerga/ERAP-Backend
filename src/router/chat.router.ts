import { Router } from "express";
import { ChatController } from "../controller";
import { validate } from "../validator/custom";
import { chatValidator } from "../validator";

export class ChatRouter {
  public router: Router;
  private chatController: ChatController;
  constructor() {
    this.router = Router();
    this.chatController = new ChatController();
  }
  public routes() {
    // create chat
    this.router
      .route("/")
      .post(validate(chatValidator.createChat), this.chatController.createChat);
    // get chat by id
    this.router
      .route("/:chatId")
      .get(validate(chatValidator.getChat), this.chatController.getChat);
    // get all chats
    this.router
      .route("/")
      .get(validate(chatValidator.getChats), this.chatController.queryChats);
    // update chat by id: this end point every thing except chat messages
    this.router
      .route("/:chatId")
      .patch(
        validate(chatValidator.updateChat),
        this.chatController.updateChat
      );
    // delete chat by id
    this.router
      .route("/:chatId")
      .delete(
        validate(chatValidator.deleteChat),
        this.chatController.deleteChat
      );

    /**
     * ----------------------------------------------------------------------------------------------------
     * only chat message end points
     * ----------------------------------------------------------------------------------------------------
     */
    // add chat messages to chat by chat id
    this.router
      .route("/:chatId/addMessages")
      .post(
        validate(chatValidator.addChatMessages),
        this.chatController.addChatMessages
      );
    // udpate chat messages by chat id
    this.router
    .route("/:chatId/updateMessages")
    .patch(
      validate(chatValidator.updateChatMessages),
      this.chatController.updateChatMessages
    );
    return this.router;
  }
}
