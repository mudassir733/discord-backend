import express, { Router } from 'express';
import { NotificationRestController } from '../controllers/userController/notificationResetController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

export class NotificationRoutes {
    private router: Router = express.Router();
    private controller: NotificationRestController;

    constructor(controller: NotificationRestController) {
        this.controller = controller;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.patch('/:id/read', authMiddleware, this.controller.markAsRead.bind(this.controller));
        this.router.get('/', authMiddleware, this.controller.getNotifications.bind(this.controller));
    }

    getRouter(): Router {
        return this.router;
    }
}