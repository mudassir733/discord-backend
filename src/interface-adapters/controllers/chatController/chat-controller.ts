import { Request, Response } from "express";
import { CreateGroupChannelUseCase } from "../../../use-case/chatUseCase/create-group-channel.js";
import { createDirectChannelUseCase } from "../../../use-case/chatUseCase/create-direct-channel.js";
import { joinChannelUseCase } from "../../../use-case/chatUseCase/join-channel.js";
import { IMessageRepository } from "../../../interfaces/chats-interfaces/IMessageRepository.js";
import { AuthenticatedRequest } from "../../../middleware/authMiddleware.js";


export class ChatController {

    private createGroupChannelUseCase: CreateGroupChannelUseCase;
    private createDirectChannelUseCase: createDirectChannelUseCase;
    private joinChannelUseCase: joinChannelUseCase;
    private messageRepository: IMessageRepository;

    constructor(
        createGroupChannelUseCase: CreateGroupChannelUseCase,
        createDirectChannelUseCase: createDirectChannelUseCase,
        joinChannelUseCase: joinChannelUseCase,
        messageRepository: IMessageRepository
    ) {
        this.createGroupChannelUseCase = createGroupChannelUseCase;
        this.createDirectChannelUseCase = createDirectChannelUseCase;
        this.joinChannelUseCase = joinChannelUseCase;
        this.messageRepository = messageRepository;
    }


    async createDirectChannel(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { otherUserUsername } = req.body;
            const userId = req.user?.id;
            console.log("USER IDD", userId)
            if (!userId) throw new Error('user id not found');
            const channel = await this.createDirectChannelUseCase.execute({ userId, otherUserUsername });
            res.status(201).json({
                channelId: channel.getId(),
                name: channel.getName(),
                isDirectChannel: channel.isDirectChannel(),
            });
        } catch (error: any) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async createGroupChannel(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { name, membersIds } = req.body;
            const creatorId = req.user?.id;
            if (!creatorId) throw new Error('creator id not found');
            if (!Array.isArray(membersIds)) {
                throw new Error("membersIds must be an array");
            }
            const channel = await this.createGroupChannelUseCase.execute({ name, creatorId, membersIds });
            res.status(201).json(channel);
        } catch (error: any) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async joinChannel(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { channelId } = req.body;
            const userId = req.user?.id;
            if (!userId) throw new Error('Unauthorized');

            await this.joinChannelUseCase.execute({ channelId, userId });
            res.status(200).json({ message: 'Joined channel' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async getMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { channelId } = req.params;
            const { limit = 50, offset = 0 } = req.query;
            const messages = await this.messageRepository.findByChannelId(
                channelId,
                parseInt(limit as string),
                parseInt(offset as string)
            );
            res.status(200).json(messages);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

}