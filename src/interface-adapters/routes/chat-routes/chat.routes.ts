import { Router } from "express";
import { ChatController } from "../../controllers/chatController/chat-controller.js";
import { authMiddleware } from "../../../middleware/authMiddleware.js";


export class ChatRoutes {

    private router: Router;
    private chatController: ChatController;

    constructor(chatController: ChatController) {
        this.router = Router();
        this.chatController = chatController;
        this.setUpRoutes();
    }

    private setUpRoutes(): void {
        // Route to create a new chat room
        this.router.post('/direct', authMiddleware, this.chatController.createDirectChannel.bind(this.chatController));
        this.router.post('/group', authMiddleware, this.chatController.createGroupChannel.bind(this.chatController));
        this.router.post('/join', authMiddleware, this.chatController.joinChannel.bind(this.chatController));
        this.router.get('/messages/:channelId', authMiddleware, this.chatController.getMessages.bind(this.chatController));
    }

    public getRouter(): Router {
        return this.router;
    }
}