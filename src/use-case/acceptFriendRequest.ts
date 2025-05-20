
import { v4 as uuidv4 } from 'uuid';
import { Friendship } from '../entities/friendship.js';
import { IFriendRequestRepository } from './IFriendRequestRepository.js';
import { IFriendshipRepository } from './IFriendshipRepository.js';

export class AcceptFriendRequestUseCase {
    constructor(
        private friendRequestRepository: IFriendRequestRepository,
        private friendshipRepository: IFriendshipRepository
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
    }
}