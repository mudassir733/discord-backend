import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../../entities/notifications.js';
import { IFriendRequestRepository } from '../../interfaces/IFriendRequestRepository.js';
import { INotificationRepository } from '../../interfaces/INotificationRepository.js';
import { NotificationController } from '../../interface-adapters/controllers/userController/notificationController.js';


export class RejectFriendRequestUseCase {
    constructor(
        private friendRequestRepository: IFriendRequestRepository,
        private notificationRepository: INotificationRepository,
        private notificationController: NotificationController
    ) { }



    async execute(requestId: string, userId: string): Promise<void> {
        const request = await this.friendRequestRepository.findById(requestId);
        if (!request) throw new Error('Friend request not found');
        if (request.getReceiverId() !== userId) throw new Error('Unauthorized');
        if (request.getStatus() !== 'pending') throw new Error('Request already processed');

        request.setStatus('rejected');
        await this.friendRequestRepository.save(request);

        // Create and send notification
        const notification = new Notification(
            uuidv4(),
            request.getSenderId(),
            'friend_request_rejected',
            `${userId} rejected your friend request`,
            new Date()
        );
        await this.notificationRepository.save(notification);
        await this.notificationController.sendNotification(notification);
    }

}