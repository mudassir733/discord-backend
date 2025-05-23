import { Socket, Server } from "socket.io";
import { Notification } from "../../../entities/notifications.js";
import { IFriendshipRepository } from "../../../interfaces/IFriendshipRepository.js";

export class NotificationController {
    private io: Server;
    private userSockets: Map<string, Socket> = new Map();
    private friendshipRepository: IFriendshipRepository;


    constructor(io: Server, friendshipRepository: IFriendshipRepository) {
        this.io = io;
        this.setupSocketEvents();
        this.friendshipRepository = friendshipRepository;
    }

    private setupSocketEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            const userId = socket.handshake.query.userId as string;
            if (userId) {
                this.userSockets.set(userId, socket);
                socket.on('disconnect', async () => {
                    this.userSockets.delete(userId);
                    await this.broadcastStatusUpdate(userId, 'offline');
                });
            }
        });
    }

    async sendNotification(notification: Notification): Promise<void> {
        const recipientSocket = this.userSockets.get(notification.getRecipientId());
        if (recipientSocket) {
            recipientSocket.emit('notification', {
                id: notification.getId(),
                type: notification.getType(),
                message: notification.getMessage(),
                createdAt: notification.getCreatedAt(),
                read: notification.isRead(),
            });
        }
    }

    async broadcastStatusUpdate(userId: string, status: 'offline' | 'online' | 'idle'): Promise<void> {
        const friendShips = await this.friendshipRepository.findByUserId(userId);

        const friendsIds = friendShips.map(friendship => friendship.getUser1Id() === userId ? friendship.getUser2Id() : friendship.getUser1Id());
        for (const friendId of friendsIds) {
            const friendSocket = this.userSockets.get(friendId);
            if (friendSocket) {
                friendSocket.emit('status_update', {
                    userId: friendId,
                    status: status,
                });
            }
        }


    }
}