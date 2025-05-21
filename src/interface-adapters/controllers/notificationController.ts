import { Socket, Server } from "socket.io";
import { Notification } from "../../entities/notifications.js";

export class NotificationController {
    private io: Server;
    private userSockets: Map<string, Socket> = new Map();

    constructor(io: Server) {
        this.io = io;
        this.setupSocketEvents();
    }

    private setupSocketEvents(): void {
        this.io.on('connection', (socket: Socket) => {
            const userId = socket.handshake.query.userId as string;
            if (userId) {
                this.userSockets.set(userId, socket);
                socket.on('disconnect', () => {
                    this.userSockets.delete(userId);
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
}