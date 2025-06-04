import { Friendship } from '../entities/friendship.js';

export interface IFriendshipRepository {
    save(friendship: Friendship): Promise<Friendship>;
    findByUserIds(userId1: string, userId2: string): Promise<Friendship | null>;
    findByUserId(userId: string): Promise<Friendship[]>;

}