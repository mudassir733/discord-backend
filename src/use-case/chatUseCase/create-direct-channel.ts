import { IChannelRepository } from "../../interfaces/chats-interfaces/IChannelRepository.js";
import { IChannelMembersRepository } from "../../interfaces/chats-interfaces/IChannelMemeberRepository.js";
import { IUserRepository } from "../../interfaces/IUserRepository.js";
import { SocketController } from "../../interface-adapters/controllers/socket-controller.js";
import { Channel } from "../../entities/chats/channels.js";

export interface createDirectChannelRequest {
    userId: string;
    otherUserUsername: string;
}

export class createDirectChannelUseCase {
    private socketController?: SocketController


    constructor(private channelRepository: IChannelRepository,
        private channelMembersRepository: IChannelMembersRepository,
        private userRepository: IUserRepository,
    ) { }

    setSocketController(socket: SocketController) {
        this.socketController = socket;
    }

    async execute(request: createDirectChannelRequest): Promise<Channel> {
        const { userId, otherUserUsername } = request;
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const otherUser = await this.userRepository.findByUserName(otherUserUsername);

        if (!otherUser) {
            throw new Error("Other user not found");
        }

        if (userId === otherUser.getId()) {
            throw new Error("Cannot create a direct channel with yourself")
        }

        // Check if a direct channel already exists between these two users
        const existingChannel = await this.channelRepository.findDirectChannelBetweenUsers(userId, otherUser.getId()!);
        if (existingChannel) {
            return existingChannel;
        }

        const channel = await this.channelRepository.create(true);

        await this.channelMembersRepository.create(channel.getId(), userId);
        await this.channelMembersRepository.create(channel.getId(), otherUser.getId()!);


        this.socketController?.notifyUserJoinChannel(userId, channel.getId());
        this.socketController?.notifyUserJoinChannel(otherUser.getId()!, channel.getId());

        return channel;
    }

}