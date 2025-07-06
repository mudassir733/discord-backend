import express, { Router } from 'express';
import { ResetPasswordController } from '../../controllers/auth/reset.password.controller.js';

export class ResetPasswordRoutes {
    private router: Router = express.Router();
    private controller: ResetPasswordController;

    constructor(controller: ResetPasswordController) {
        this.controller = controller;
        this.initRoutes();
    }


    private initRoutes(): void {
        this.router.post('/initiate-reset', this.controller.initiateResetPassword.bind(this.controller));
        this.router.post('/verify-token', this.controller.verifyResetToken.bind(this.controller));
        this.router.post('/reset-password', this.controller.resetPasswords.bind(this.controller));
    }

    getRouter(): Router {
        return this.router;
    }
}