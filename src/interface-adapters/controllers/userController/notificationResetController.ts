import { Response, Request } from 'express';
import { MarkNotificationAsRead, MarkNotificationAsReadInput } from '../../../use-case/userUseCase/markNotificationAsRead.js';
import { INotificationRepository } from '../../../interfaces/INotificationRepository.js';
import { AuthenticatedRequest } from '../../../middleware/authMiddleware.js';
import { GetNotificationsUseCase } from '../../../use-case/userUseCase/getNotifications.js';

export class NotificationRestController {
    private markNotificationAsRead: MarkNotificationAsRead;
    private getNotificationsUseCase: GetNotificationsUseCase;

    constructor(notificationRepository: INotificationRepository) {
        this.markNotificationAsRead = new MarkNotificationAsRead(notificationRepository);
        this.getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
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


    async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { type, read } = req.query;
            const notifications = await this.getNotificationsUseCase.execute({
                userId,
                type: type as string | undefined,
                read: read !== undefined ? read === 'true' : undefined,
            });

            res.status(200).json({
                notifications: notifications.map(n => ({
                    id: n.getId(),
                    type: n.getType(),
                    message: n.getMessage(),
                    createdAt: n.getCreatedAt(),
                    read: n.isRead(),
                })),
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}