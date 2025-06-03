import { Channel } from "../../entities/chats/channels.js";

export interface IChannelRepository {
    create(isDirect: boolean, name?: string): Promise<Channel>
    findById(id: string): Promise<Channel | null>
    findDirectChannelBetweenUsers(user1Id: string, user2Id: string): Promise<Channel | null>
}