import { ChannelMembers } from "../../entities/chats/channelMembers.js";

export interface IChannelMembersRepository {
    create(channelId: string, userId: string): Promise<ChannelMembers>;
    findChannelAndUser(channelId: string, userId: string): Promise<ChannelMembers | null>
    findChannelByUserId(userId: string): Promise<ChannelMembers[]>
}