import { Request, Response } from 'express';
import { SendFriendRequestUseCase } from '../../use-case/SendFriendRequest.js';
import { AcceptFriendRequestUseCase } from '../../use-case/acceptFriendRequest.js';
import { GetFriendsUseCase } from '../../use-case/getFriends.js';
import { SearchUsersUseCase } from '../../use-case/searchUsers.js';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

export class FriendController {
    constructor(
        private sendFriendRequestUseCase: SendFriendRequestUseCase,
        private acceptFriendRequestUseCase: AcceptFriendRequestUseCase,
        private getFriendsUseCase: GetFriendsUseCase,
        private searchUsersUseCase: SearchUsersUseCase
    ) { }


    async sendFriendRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
        const senderId = req.user?.id;
        const { receiverUsername } = req.body;
        console.log("rec, name", receiverUsername)
        console.log("Req body", req.body)


        if (!receiverUsername) {
            res.status(400).json({ error: 'Receiver username is required' });
            return;


        }

        try {
            const friendRequest = await this.sendFriendRequestUseCase.execute(senderId!, receiverUsername);
            console.log("FRND----", friendRequest)
            res.status(201).json(friendRequest);
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