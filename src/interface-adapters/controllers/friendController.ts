import { Request, Response } from 'express';
import { SendFriendRequestUseCase } from '../../use-case/SendFriendRequest.js';
import { AcceptFriendRequestUseCase } from '../../use-case/acceptFriendRequest.js';
import { GetFriendsUseCase } from '../../use-case/getFriends.js';
import { RejectFriendRequestUseCase } from '../../use-case/rejectFriendRequest.js';
import { SearchUsersUseCase } from '../../use-case/searchUsers.js';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

export class FriendController {
    constructor(
        private sendFriendRequestUseCase: SendFriendRequestUseCase,
        private acceptFriendRequestUseCase: AcceptFriendRequestUseCase,
        private rejectFriendRequestUseCase: RejectFriendRequestUseCase,
        private getFriendsUseCase: GetFriendsUseCase,
        private searchUsersUseCase: SearchUsersUseCase
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
            res.status(200).json(users);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }


}