import { FriendRequest } from '../entities/friendRequest.js';

export interface IFriendRequestRepository {
    save(friendRequest: FriendRequest): Promise<FriendRequest>;
    findById(id: string): Promise<FriendRequest | null>;
    findPendingBySenderAndReceiver(senderId: string, receiverId: string): Promise<FriendRequest | null>;
}