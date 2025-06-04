import { IChannelRepository } from "../../interfaces/chats-interfaces/IChannelRepository.js";
import { IChannelMembersRepository } from "../../interfaces/chats-interfaces/IChannelMemeberRepository.js";
import { ChannelMembers } from "../../entities/chats/channelMembers.js";
import { SocketController } from "../../interface-adapters/controllers/socket-controller.js";

export interface joinChannelRequest {
    userId: string;
    channelId: string;
}


export class joinChannelUseCase {
    private socketController?: SocketController

    constructor(
        private readonly channelRepository: IChannelRepository,
        private readonly channelMembersRepository: IChannelMembersRepository,


    ) { }

    setSocketController(socket: SocketController) {
        this.socketController = socket;
    }

    async execute(request: joinChannelRequest): Promise<ChannelMembers> {
        const { userId, channelId } = request;
        const channel = await this.channelRepository.findById(channelId);
        if (!channel) {
            throw new Error("Channel not found!");
        }
        if (channel.isDirectChannel()) throw new Error('Cannot join direct channels');

        const existingMemeberShipt = await this.channelMembersRepository.findChannelAndUser(channelId, userId);
        if (existingMemeberShipt) {
            throw new Error("User already in this channel");
        }

        const memeberShip = await this.channelMembersRepository.create(channelId, userId);
        this.socketController?.notifyUserJoinChannel(userId, channelId);

        return memeberShip;


    }

}