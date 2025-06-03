import { IChannelRepository } from "../../interfaces/chats-interfaces/IChannelRepository.js";
import { IChannelMembersRepository } from "../../interfaces/chats-interfaces/IChannelMemeberRepository.js";
import { Channel } from "../../entities/chats/channels.js";

export interface createGroupChannelRequest {
    name: string;
    creatorId: string;
    membersIds: string[];
}

export class CreateGroupChannelUseCase {
    constructor(
        private readonly channelRepository: IChannelRepository,
        private readonly channelMembersRepository: IChannelMembersRepository
    ) { }

    async execute(request: createGroupChannelRequest): Promise<Channel> {
        const { name, creatorId, membersIds } = request;

        const channel = await this.channelRepository.create(false, name)
        const uniquerMemberIds = [...new Set([creatorId, ...membersIds])]


        for (const userId of uniquerMemberIds) {
            await this.channelMembersRepository.create(channel.getId(), userId)
        }

        return channel;
    }

}