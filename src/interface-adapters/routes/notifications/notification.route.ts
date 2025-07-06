import express, { Router } from 'express';
import { NotificationController } from '../../controllers/notifications/notification.controller.js';
import { authMiddleware } from '../../../middleware/authMiddleware.js';

export class NotificationRoutes {
    private router: Router = express.Router();
    private controller: NotificationController;

    constructor(controller: NotificationController) {
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