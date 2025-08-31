
import { v4 as uuidv4 } from 'uuid';
import { Friendship } from '../../entities/friendship.js';
import { Notification } from '../../entities/notifications.js';
import { IFriendRequestRepository } from '../../interfaces/IFriendRequestRepository.js';
import { IFriendshipRepository } from '../../interfaces/IFriendshipRepository.js';
import { INotificationRepository } from '../../interfaces/INotificationRepository.js';
import { SocketNotificationController } from '../../interface-adapters/controllers/userController/notificationController.js';
import { IUserRepository } from '../../interfaces/IUserRepository.js';

export class AcceptFriendRequestUseCase {
    constructor(
        private userRepository: IUserRepository,
        private friendRequestRepository: IFriendRequestRepository,
        private friendshipRepository: IFriendshipRepository,
        private notificationRepository: INotificationRepository,
        private notificationController: SocketNotificationController
    ) { }

    async execute(requestId: string, userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new Error('User not found');
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
            `${user.getUsername()} has accepted your friend request`,
            new Date()
        )
        await this.notificationRepository.save(notification)
        await this.notificationController.sendNotification(notification)

        // Refresh friend cache for both users
        await this.notificationController.refreshFriendCache(userId)
        await this.notificationController.refreshFriendCache(request.getSenderId())

    }
}