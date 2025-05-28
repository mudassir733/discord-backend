import { Request, Response } from 'express';
import { GetIncomingFriendRequests, GetIncomingFriendRequestsInput } from '../../../use-case/userUseCase/getIncommingFriendRequest.js';
import { IUserRepository } from '../../../interfaces/IUserRepository.js';
import { AuthenticatedRequest } from '../../../middleware/authMiddleware.js';

export class FriendRequestController {
    private getIncommingFriendRequest: GetIncomingFriendRequests



    constructor(userRepository: IUserRepository) {
        this.getIncommingFriendRequest = new GetIncomingFriendRequests(userRepository);

    }

    async getIncomingFriendRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('User ID not found in token');
            const input: GetIncomingFriendRequestsInput = { userId };
            const friendRequests = await this.getIncommingFriendRequest.execute(input);
            res.status(200).json(friendRequests);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }


}