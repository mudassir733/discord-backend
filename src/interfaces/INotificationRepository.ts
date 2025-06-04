import { Notification } from "../entities/notifications.js";

export interface INotificationRepository {
    save(notification: Notification): Promise<Notification>;
    updateReadStatus(notificationId: string, userId: string, read: boolean): Promise<Notification>;
    findByUserId(userId: string, filters?: { type?: string; read?: boolean }): Promise<Notification[]>;
}