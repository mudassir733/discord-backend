import { Server, Socket } from "socket.io"
import { IChannelMembersRepository } from "../../interfaces/chats-interfaces/IChannelMemeberRepository.js"
import { SendMessageUseCase } from "../../use-case/chatUseCase/send-message.js"
import { joinChannelUseCase } from "../../use-case/chatUseCase/join-channel.js"


export class SocketController {
    private userSockets: Map<string, Socket> = new Map();

    constructor(
        private io: Server,
        private channelMembersRepository: IChannelMembersRepository,
        private sendMessageUseCase: SendMessageUseCase,
        private joinChannelUseCase: joinChannelUseCase
    ) {
        this.setUpSocketEvents();
    }

    async setUpSocketEvents(): Promise<void> {
        this.io.on('connection', async (socket: Socket) => {
            const userId = socket.handshake.query.userId;
            if (!userId) {
                socket.disconnect()
                return;
            }

            this.userSockets.set(userId as string, socket)
            socket.emit("hellow", "world")


            const memberShip = await this.channelMembersRepository.findChannelByUserId(userId as string);
            memberShip.forEach((member) => {
                socket.join(`channel_${member.getChannelId()}`)
            })

            socket.on('send_message', async ({ content, channelId }) => {
                try {
                    const message = await this.sendMessageUseCase.execute({
                        content,
                        channelId,
                        senderId: userId as string
                    })
                    this.io.to(`channel_${channelId}`).emit('receive_message', {
                        id: message.getId(),
                        content: message.getContent(),
                        channelId: message.getChannelId(),
                        createAt: message.getCreateAt(),
                        senderId: message.getSenderId()
                    })
                    const sender = this.userSockets.get(userId as string);
                    if (sender) {
                        this.io.to(sender.id).emit('receive_message', {
                            id: message.getId(),
                            content: message.getContent(),
                            channelId: message.getChannelId(),
                            createAt: message.getCreateAt(),
                            senderId: message.getSenderId()
                        })
                    }
                } catch (error) {
                    socket.emit('error', { message: (error as Error).message });
                }
            })

            socket.on('join_channel', async ({ channelId }) => {
                try {
                    await this.joinChannelUseCase.execute({ userId: userId as string, channelId })
                    socket.join(`channel_${channelId}`)
                    socket.emit('channel_joined', { channelId });
                } catch (error) {
                    socket.emit('error', { message: (error as Error).message });

                }
            })

            socket.on('disconnect', () => {
                this.userSockets.delete(userId as string);
            });
        })

    }

    notifyUserJoinChannel(userId: string, channelId: string): void {
        const socket = this.userSockets.get(userId);
        if (socket) {
            socket.join(`channel_${channelId}`);
        }
    }
}