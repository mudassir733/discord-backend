import { IUserRepository } from '../../interfaces/IUserRepository.js';
import { IdleScheduler } from '../../utils/idleSchedular.js';
import { SocketNotificationController } from '../../interface-adapters/controllers/userController/notificationController.js';

export class LogoutUser {
    constructor(
        private userRepository: IUserRepository,
        private idleScheduler: IdleScheduler,
        private notificationController: SocketNotificationController
    ) { }

    async execute(userId: string): Promise<void> {
        await this.userRepository.updateUserStatus(userId, 'offline');
        this.idleScheduler.cancel(userId);
        await this.notificationController.broadcastStatusUpdate(userId, 'offline');
    }
}