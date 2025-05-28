import { IFriendRequestRepository, SentFriendRequest } from '../../interfaces/IFriendRequestRepository.js';

export interface GetSentFriendRequestsInputUseCase {
    userId: string;
}

export class GetSentFriendRequestsUseCase {
    constructor(private friendRequestRepository: IFriendRequestRepository) { }

    async execute(input: GetSentFriendRequestsInputUseCase): Promise<SentFriendRequest[]> {
        return await this.friendRequestRepository.getSentFriendRequests(input.userId);
    }
}