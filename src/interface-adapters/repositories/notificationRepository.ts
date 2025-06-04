import { INotificationRepository } from '../../interfaces/INotificationRepository.js';
import { Notification } from '../../entities/notifications.js';
import { prisma } from '../../config/database.js';


const VALID_NOTIFICATION_TYPES = [
    'friend_request_sent',
    'friend_request_accepted',
    'friend_request_rejected',
] as const;

type NotificationType = typeof VALID_NOTIFICATION_TYPES[number];

function assertValidType(type: string): NotificationType {
    if (!VALID_NOTIFICATION_TYPES.includes(type as NotificationType)) {
        throw new Error(`Invalid notification type: ${type}`);
    }
    return type as NotificationType;
}

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
            assertValidType(saved.type),
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
            assertValidType(updated.type),
            updated.message,
            updated.createdAt,
            updated.read
        );
    }

    async findByUserId(userId: string, filters?: { type?: string; read?: boolean }): Promise<Notification[]> {
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
                ...(filters?.type && { type: filters.type }),
                ...(filters?.read !== undefined && { read: filters.read }),
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return notifications.map(
            n => new Notification(
                n.id,
                n.userId,
                assertValidType(n.type),
                n.message,
                n.createdAt,
                n.read
            )
        );
    }

}