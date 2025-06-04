import schedule, { Job } from 'node-schedule';
import { NotificationController } from '../interface-adapters/controllers/userController/notificationController.js';

export class IdleScheduler {
    private idleJobs: Map<string, Job> = new Map();



    constructor(private idleCallback: (userId: string) => Promise<void>, private notificationController: NotificationController) { }

    schedule(userId: string, delayMinutes: number = 10): void {
        // Cancel existing job if any
        this.cancel(userId);

        const runAt = new Date(Date.now() + delayMinutes * 60 * 1000);

        const job = schedule.scheduleJob(runAt, async () => {
            await this.idleCallback(userId);
            await this.notificationController.broadcastStatusUpdate(userId, 'idle');
            this.idleJobs.delete(userId);
        });

        this.idleJobs.set(userId, job);
    }

    cancel(userId: string) {
        const job = this.idleJobs.get(userId);
        if (job) {
            job.cancel();
            this.idleJobs.delete(userId);
        }
    }

    clearAll() {
        this.idleJobs.forEach((job) => job.cancel());
        this.idleJobs.clear();
    }

    setNotificationController(controller: NotificationController): void {
        this.notificationController = controller;
    }
}
