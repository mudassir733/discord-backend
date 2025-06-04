import { INotificationRepository } from '../../interfaces/INotificationRepository.js';
import { Notification } from '../../entities/notifications.js';

export interface GetNotificationsRequest {
    userId: string;
    type?: string;
    read?: boolean;
}

export class GetNotificationsUseCase {
    constructor(private notificationRepository: INotificationRepository) { }

    async execute(request: GetNotificationsRequest): Promise<Notification[]> {
        const { userId, type, read } = request;
        return await this.notificationRepository.findByUserId(userId, { type, read });
    }



}