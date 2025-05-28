import { FriendRequest } from '../entities/friendRequest.js';

export interface SentFriendRequest {
    id: string;
    receiverId: string;
    receiverUsername: string;
    receiverDisplayName: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
}

export interface IFriendRequestRepository {
    save(friendRequest: FriendRequest): Promise<FriendRequest>;
    findById(id: string): Promise<FriendRequest | null>;
    findPendingBySenderAndReceiver(senderId: string, receiverId: string): Promise<FriendRequest | null>;
    findRejectedBySenderAndReceiver(senderId: string, receiverId: string): Promise<FriendRequest | null>;
    getSentFriendRequests(senderId: string): Promise<SentFriendRequest[]>;
}