import { Messages } from "../../entities/chats/messages.js";

export interface IMessageRepository {
    create(content: string, channelId: string, userId: string): Promise<Messages>;
    findByChannelId(channelId: string, limit: number, offset: number): Promise<Messages[]>;
}
