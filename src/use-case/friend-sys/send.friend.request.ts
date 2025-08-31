import { v4 as uuidv4 } from 'uuid';
import { FriendRequest } from '../../entities/friendRequest.js';
import { IUserRepository } from '../../interfaces/IUserRepository.js';
import { IFriendRequestRepository } from '../../interfaces/IFriendRequestRepository.js';
import { IFriendshipRepository } from '../../interfaces/IFriendshipRepository.js';
import { INotificationRepository } from '../../interfaces/INotificationRepository.js';
import { SocketNotificationController } from '../../interface-adapters/controllers/userController/notificationController.js';
import { Notification } from '../../entities/notifications.js';


export interface SendFriendRequestResponse {
    friendRequest: FriendRequest;
    message: string;
}

export class SendFriendRequestUseCase {
    constructor(
        private userRepository: IUserRepository,
        private friendRequestRepository: IFriendRequestRepository,
        private friendshipRepository: IFriendshipRepository,
        private notificationRepository: INotificationRepository,
        private notificationController: SocketNotificationController
    ) { }

    async execute(senderId: string, receiverUsername: string): Promise<SendFriendRequestResponse> {
        const sender = await this.userRepository.findById(senderId);
        if (!sender) throw new Error('Sender not found');

        const receiver = await this.userRepository.findByUserName(receiverUsername);
        if (!receiver) throw new Error('Receiver not found');

        if (sender.getId() === receiver.getId()) throw new Error('Cannot send request to self');

        const existingFriendship = await this.friendshipRepository.findByUserIds(sender.getId()!, receiver.getId()!);
        if (existingFriendship) throw new Error('Already friends');

        const pendingRequest = await this.friendRequestRepository.findPendingBySenderAndReceiver(sender.getId()!, receiver.getId()!);
        if (pendingRequest) throw new Error('Friend request already sent');

        // rejected request
        let friendRequest: FriendRequest;
        const rejectedRequest = await this.friendRequestRepository.findRejectedBySenderAndReceiver(sender.getId()!, receiver.getId()!);

        if (rejectedRequest) {
            // Update the rejected request to pending
            rejectedRequest.setStatus('pending');
            rejectedRequest.setCreatedAt(new Date());
            friendRequest = await this.friendRequestRepository.save(rejectedRequest);
        } else {
            // Create a new friend request
            friendRequest = new FriendRequest(uuidv4(), sender.getId()!, receiver.getId()!, 'pending', new Date());
            friendRequest = await this.friendRequestRepository.save(friendRequest);
        }

        const notification = new Notification(
            uuidv4(),
            receiver.getId()!,
            'friend_request_sent',
            `${sender.getUsername()} has sent you a friend request.`,
            new Date()
        )
        await this.notificationRepository.save(notification);
        await this.notificationController.sendNotification(notification)

        return {
            friendRequest,
            message: `Friend request sent to ${receiver.getUsername()}`
        };
    }
}