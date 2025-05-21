import { Notification } from "../entities/notifications.js";

export interface INotificationRepository {
    save(notification: Notification): Promise<Notification>;
}