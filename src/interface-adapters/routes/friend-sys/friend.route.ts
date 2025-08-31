import { Router } from 'express';
import { FriendController } from '../../controllers/friend-sys/friend.controller.js';
import { authMiddleware } from '../../../middleware/authMiddleware.js';

export class FriendRoutes {
    private router: Router = Router();
    private controller: FriendController;

    constructor(controller: FriendController) {
        this.controller = controller;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post('/friend-requests', authMiddleware, this.controller.sendFriendRequest.bind(this.controller));
        this.router.post('/friend-requests/:id/accept', authMiddleware, this.controller.acceptFriendRequest.bind(this.controller));
        this.router.post('/friend-request/:id/reject', authMiddleware, this.controller.rejectFriendRequest.bind(this.controller))
        this.router.get('/friends', authMiddleware, this.controller.getFriends.bind(this.controller));
        this.router.get('/users/search', authMiddleware, this.controller.searchUsers.bind(this.controller));
        this.router.get('/friend-requests/sent', authMiddleware, this.controller.getSentFriendRequests.bind(this.controller));
        this.router.get('/incoming', authMiddleware, this.controller.getIncomingFriendRequests.bind(this.controller));
    }

    getRouter(): Router {
        return this.router;
    }
}