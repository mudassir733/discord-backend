import { INotificationRepository } from '../../../interfaces/INotificationRepository.js';
import { Notification } from '../../../entities/notifications.js';

export interface MarkNotificationAsReadInput {
    notificationId: string;
    userId: string;
}

export class MarkNotificationAsRead {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(input: MarkNotificationAsReadInput): Promise<Notification> {
        const { notificationId, userId } = input;
        const notification = await this.notificationRepository.updateReadStatus(notificationId, userId, true);
        return notification;
    }
}