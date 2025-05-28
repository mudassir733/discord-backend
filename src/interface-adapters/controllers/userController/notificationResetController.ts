import { Response } from 'express';
import { MarkNotificationAsRead, MarkNotificationAsReadInput } from '../../../use-case/userUseCase/markNotificationAsRead.js';
import { INotificationRepository } from '../../../interfaces/INotificationRepository.js';
import { AuthenticatedRequest } from '../../../middleware/authMiddleware.js';

export class NotificationRestController {
    private markNotificationAsRead: MarkNotificationAsRead;

    constructor(notificationRepository: INotificationRepository) {
        this.markNotificationAsRead = new MarkNotificationAsRead(notificationRepository);
    }

    async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('User ID not found in token');
            const { id } = req.params;
            const input: MarkNotificationAsReadInput = { notificationId: id, userId };
            const notification = await this.markNotificationAsRead.execute(input);
            res.status(200).json({ message: 'Notification marked as read', notification });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}