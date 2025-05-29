import { INotificationRepository } from '../../interfaces/INotificationRepository.js';
import { Notification } from '../../entities/notifications.js';
import { prisma } from '../../config/database.js';


export class NotificationRepository implements INotificationRepository {
    async save(notification: Notification): Promise<Notification> {
        const saved = await prisma.notification.create({
            data: {
                id: notification.getId(),
                type: notification.getType(),
                message: notification.getMessage(),
                createdAt: notification.getCreatedAt(),
                read: notification.isRead(),
                recipient: {
                    connect: { id: notification.getRecipientId() },
                },
            },
        });

        return new Notification(
            saved.id,
            saved.userId,
            saved.type as 'friend_request_sent' | 'friend_request_accepted' | 'friend_request_rejected',
            saved.message,
            saved.createdAt,
        );
    }

    async updateReadStatus(notificationId: string, userId: string, read: boolean): Promise<Notification> {
        const updated = await prisma.notification.update({
            where: {
                id: notificationId,
                userId, // Ensure only the notification's owner can update
            },
            data: {
                read,
            },
        });

        return new Notification(
            updated.id,
            updated.userId,
            updated.type as 'friend_request_sent' | 'friend_request_accepted' | 'friend_request_rejected',
            updated.message,
            updated.createdAt,
            updated.read
        );
    }
}