import { IUserRepository } from './IUserRepository.js';
import { IdleScheduler } from '../utils/idleSchedular.js';
import { NotificationController } from '../interface-adapters/controllers/notificationController.js';

export class LogoutUser {
    constructor(
        private userRepository: IUserRepository,
        private idleScheduler: IdleScheduler,
        private notificationController: NotificationController
    ) { }

    async execute(userId: string): Promise<void> {
        await this.userRepository.updateUserStatus(userId, 'offline');
        this.idleScheduler.cancel(userId);
        await this.notificationController.broadcastStatusUpdate(userId, 'offline');
    }
}