import { Socket, Server } from "socket.io";
import { Notification } from "../../../entities/notifications.js";
import { IFriendshipRepository } from "../../../interfaces/IFriendshipRepository.js";
import { IUserRepository } from "../../../interfaces/IUserRepository.js";
import { IdleScheduler } from "../../../utils/idleSchedular.js";

export class NotificationController {
    private io: Server;
    private userSockets: Map<string, Socket> = new Map();
    private friendshipRepository: IFriendshipRepository;
    private userRepository: IUserRepository;
    private idleScheduler: IdleScheduler;
    private friendCache: Map<string, string[]>; // Cache friend IDs
    private cacheTTL: number; // Cache TTL in milliseconds


    constructor(io: Server, friendshipRepository: IFriendshipRepository, userRepository: IUserRepository,
        idleScheduler: IdleScheduler) {
        this.io = io;
        this.setupSocketEvents();
        this.friendshipRepository = friendshipRepository;
        this.friendCache = new Map();
        this.cacheTTL = 10 * 60 * 1000; // 5 minutes
        this.userRepository = userRepository;
        this.idleScheduler = idleScheduler;
    }

    private setupSocketEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            const userId = socket.handshake.query.userId as string;
            if (userId) {
                this.userSockets.set(userId, socket);
                // Set user online on connection
                this.handleUserActivity(userId);

                socket.on('user_activity', () => {
                    this.handleUserActivity(userId);
                });

                socket.on('disconnect', async () => {
                    this.userSockets.delete(userId);
                    try {
                        await this.userRepository.updateUserStatus(userId, 'offline');
                        await this.broadcastStatusUpdate(userId, 'offline');
                        this.idleScheduler.cancel(userId);
                        this.friendCache.delete(userId); // Clear cache on disconnect
                    } catch (error) {
                        console.error(`Error handling disconnect for user ${userId}:`, error);
                    }
                });
            }
        });
    }

    private async handleUserActivity(userId: string): Promise<void> {
        // Cancel existing idle timer
        this.idleScheduler.cancel(userId);

        // Update status to online
        await this.userRepository.updateUserStatus(userId, 'online');

        // Broadcast online status to friends
        await this.broadcastStatusUpdate(userId, 'online');

        // Reschedule idle timer for 5 minutes
        this.idleScheduler.schedule(userId, 5);
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

    // Method to refresh friend cache when friend list changes
    async refreshFriendCache(userId: string): Promise<void> {
        try {
            const friendships = await this.friendshipRepository.findByUserId(userId);
            const friendIds = friendships.map(friendship =>
                friendship.getUser1Id() === userId ? friendship.getUser2Id() : friendship.getUser1Id()
            );
            this.friendCache.set(userId, friendIds);
            setTimeout(() => this.friendCache.delete(userId), this.cacheTTL);
        } catch (error) {
            console.error(`Error refreshing friend cache for user ${userId}:`, error);
        }
    }
}