import { IUserRepository, FriendRequest } from '../../interfaces/IUserRepository.js';

export interface GetIncomingFriendRequestsInput {
    userId: string;
}

export class GetIncomingFriendRequests {
    constructor(private userRepository: IUserRepository) { }

    async execute(input: GetIncomingFriendRequestsInput): Promise<FriendRequest[]> {
        return await this.userRepository.getIncomingFriendRequests(input.userId);
    }
}