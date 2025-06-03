import { IChannelMembersRepository } from "../../interfaces/chats-interfaces/IChannelMemeberRepository.js";
import { IMessageRepository } from "../../interfaces/chats-interfaces/IMessageRepository.js";
import { Messages } from "../../entities/chats/messages.js";

export interface sendMessageRequest {
    content: string;
    channelId: string;
    senderId: string;
}

export class SendMessageUseCase {
    constructor(
        private messageRepository: IMessageRepository,
        private channelMembersRepository: IChannelMembersRepository
    ) { }

    async execute(request: sendMessageRequest): Promise<Messages> {
        const { content, channelId, senderId } = request;
        const memberShip = await this.channelMembersRepository.findChannelAndUser(channelId, senderId);
        if (!memberShip) {
            throw new Error("User is not a member of this channel")
        }

        return await this.messageRepository.create(content, channelId, senderId)
    }

}