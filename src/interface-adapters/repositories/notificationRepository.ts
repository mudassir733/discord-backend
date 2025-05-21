import { INotificationRepository } from '../../use-case/INotificationRepository.js';
import { Notification } from '../../entities/notifications.js';
import { prisma } from '../../config/database.js';


export class NotificationRepository implements INotificationRepository {
    async save(notification: Notification): Promise<Notification> {
        const savedNotification = await prisma.notification.create({
            data: {
                id: notification.getId(),
                recipientId: notification.getRecipientId(),
                type: notification.getType(),
                message: notification.getMessage(),
                createdAt: notification.getCreatedAt(),
                read: notification.isRead(),
            },
        });
        return new Notification(
            savedNotification.id,
            savedNotification.recipientId,
            savedNotification.type as 'friend_request_sent' | 'friend_request_accepted' | 'friend_request_rejected',
            savedNotification.message,
            savedNotification.createdAt,
            savedNotification.read
        );
    }

}