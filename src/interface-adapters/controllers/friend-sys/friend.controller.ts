import { Request, Response } from 'express';

import { SearchUsersUseCase } from '../../../use-case/user/searchUsers.js';
import { AuthenticatedRequest } from '../../../middleware/authMiddleware.js';


// use-cases
import { SendFriendRequestUseCase } from '../../../use-case/friend-sys/send.friend.request.js';
import { AcceptFriendRequestUseCase } from '../../../use-case/friend-sys/accept.friend.request.js';
import { GetFriendsUseCase } from '../../../use-case/friend-sys/get.friends.js';
import { RejectFriendRequestUseCase } from '../../../use-case/friend-sys/reject.friend.request.js';
import { GetSentFriendRequestsInputUseCase, GetSentFriendRequestsUseCase } from '../../../use-case/friend-sys/get.send.request.js';


export class FriendController {
    constructor(
        private sendFriendRequestUseCase: SendFriendRequestUseCase,
        private acceptFriendRequestUseCase: AcceptFriendRequestUseCase,
        private rejectFriendRequestUseCase: RejectFriendRequestUseCase,
        private getFriendsUseCase: GetFriendsUseCase,
        private searchUsersUseCase: SearchUsersUseCase,
        private getSentFriendRequestsUseCase: GetSentFriendRequestsUseCase
    ) { }


    async sendFriendRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
        const senderId = req.user?.id;
        const { receiverUsername } = req.body;
        if (!receiverUsername) {
            res.status(400).json({ error: 'Receiver username is required' });
            return;
        }
        try {
            const friendRequest = await this.sendFriendRequestUseCase.execute(senderId!, receiverUsername);
            res.status(200).json(friendRequest);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async acceptFriendRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
        const { id } = req.params;
        const userId = req.user?.id;
        try {
            await this.acceptFriendRequestUseCase.execute(id, userId!);
            res.status(200).json({ message: 'Friend request accepted' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async rejectFriendRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
        const { id } = req.params;
        const userId = req.user?.id;
        try {
            if (!userId) throw new Error("User not found")
            await this.rejectFriendRequestUseCase.execute(id, userId);
            res.status(200).json({ message: 'Friend request rejected' });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });

        }
    }


    async getFriends(req: AuthenticatedRequest, res: Response): Promise<void> {
        const userId = req.user?.id;
        try {
            const friends = await this.getFriendsUseCase.execute(userId!);
            res.status(200).json(friends);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
    async searchUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
        const { query } = req.query;
        const currentUserId = req.user?.id;
        try {
            const users = await this.searchUsersUseCase.execute(query as string, currentUserId!);
            if (!users) {
                res.status(404).json({ error: 'Users not found' });
                return;
            }
            res.status(200).json(users);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getSentFriendRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('User ID not found in token');
            const input: GetSentFriendRequestsInputUseCase = { userId };
            const friendRequests = await this.getSentFriendRequestsUseCase.execute(input);
            res.status(200).json(friendRequests);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }


}