
import { v4 as uuidv4 } from 'uuid';
import { Friendship } from '../entities/friendship.js';
import { Notification } from '../entities/notifications.js';
import { IFriendRequestRepository } from './IFriendRequestRepository.js';
import { IFriendshipRepository } from './IFriendshipRepository.js';
import { INotificationRepository } from './INotificationRepository.js';
import { NotificationController } from '../interface-adapters/controllers/notificationController.js';

export class AcceptFriendRequestUseCase {
    constructor(
        private friendRequestRepository: IFriendRequestRepository,
        private friendshipRepository: IFriendshipRepository,
        private notificationRepository: INotificationRepository,
        private notificationController: NotificationController
    ) { }

    async execute(requestId: string, userId: string): Promise<void> {
        const request = await this.friendRequestRepository.findById(requestId);
        if (!request) throw new Error('Friend request not found');
        if (request.getReceiverId() !== userId) throw new Error('Unauthorized');
        if (request.getStatus() !== 'pending') throw new Error('Request already processed');

        request.setStatus('accepted');
        await this.friendRequestRepository.save(request);

        const friendship = new Friendship(uuidv4(), request.getSenderId(), request.getReceiverId(), new Date());
        await this.friendshipRepository.save(friendship);

        const notification = new Notification(
            uuidv4(),
            request.getSenderId(),
            'friend_request_accepted',
            `${userId} has accepted your friend request`,
            new Date()
        )
        await this.notificationRepository.save(notification)
        await this.notificationController.sendNotification(notification)


    }
}