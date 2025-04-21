import express, { Router } from 'express';
import { ResetPasswordController } from '../controllers/resetPasswordController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

export class ResetPasswordRoutes {
    private router: Router = express.Router();
    private controller: ResetPasswordController;

    constructor(controller: ResetPasswordController) {
        this.controller = controller;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post('/initiate-reset', authMiddleware, (req, res) => this.controller.initiateResetPassword(req, res));
        this.router.post('/verify-token', (req, res) => this.controller.verifyResetToken(req, res));
        this.router.post('/reset-password', (req, res) => this.controller.resetPasswords(req, res));
    }

    getRouter(): Router {
        return this.router;
    }
}