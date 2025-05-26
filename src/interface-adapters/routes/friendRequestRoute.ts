import express, { Router } from 'express';
import { FriendRequestController } from '../controllers/userController/friendRequestcontroller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

export class FriendRequestRoutes {
    private router: Router = express.Router();
    private controller: FriendRequestController;

    constructor(controller: FriendRequestController) {
        this.controller = controller;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get('/incoming', authMiddleware, this.controller.getIncomingFriendRequests.bind(this.controller));
    }

    getRouter(): Router {
        return this.router;
    }
}