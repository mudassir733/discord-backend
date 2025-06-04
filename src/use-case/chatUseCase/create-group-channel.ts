import { IChannelRepository } from "../../interfaces/chats-interfaces/IChannelRepository.js";
import { IChannelMembersRepository } from "../../interfaces/chats-interfaces/IChannelMemeberRepository.js";
import { Channel } from "../../entities/chats/channels.js";
import { SocketController } from "../../interface-adapters/controllers/socket-controller.js";

export interface createGroupChannelRequest {
    name: string;
    creatorId: string;
    membersIds: string[];
}

export class CreateGroupChannelUseCase {
    private socketController?: SocketController

    constructor(
        private readonly channelRepository: IChannelRepository,
        private readonly channelMembersRepository: IChannelMembersRepository,

    ) { }
    setSocketController(socket: SocketController) {
        this.socketController = socket;
    }

    async execute(request: createGroupChannelRequest): Promise<Channel> {
        const { name, creatorId, membersIds } = request;

        const channel = await this.channelRepository.create(false, name)
        const uniquerMemberIds = [...new Set([creatorId, ...membersIds])]



        for (const userId of uniquerMemberIds) {
            await this.channelMembersRepository.create(channel.getId(), userId)
            this.socketController?.notifyUserJoinChannel(userId, channel.getId());
        }

        return channel;
    }

}