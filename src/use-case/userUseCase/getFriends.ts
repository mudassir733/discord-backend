import { User } from '../../entities/user.js';
import { IFriendshipRepository } from '../../interfaces/IFriendshipRepository.js';
import { IUserRepository } from '../../interfaces/IUserRepository.js';

export class GetFriendsUseCase {
    constructor(
        private friendshipRepository: IFriendshipRepository,
        private userRepository: IUserRepository
    ) { }

    async execute(userId: string): Promise<User[]> {
        const friendships = await this.friendshipRepository.findByUserId(userId);
        const friendIds = friendships.map(f => f.getUser1Id() === userId ? f.getUser2Id() : f.getUser1Id());
        const friends = await Promise.all(friendIds.map(id => this.userRepository.findById(id)));
        return friends.filter((f): f is User => f !== null);
    }
}