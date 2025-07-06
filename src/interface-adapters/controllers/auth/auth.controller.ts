import { Request, Response } from "express";
import { ZodError } from "zod";

import { IUserRepository } from "../../../interfaces/IUserRepository.js";
import { NotificationController } from "../notifications/notification.controller.js";
import { AuthenticatedRequest } from "../../../middleware/authMiddleware.js";

// utils
import { IdleScheduler } from "../../../utils/idleSchedular.js";

// use-cases
import { RegisterUser, RegisterUserInput } from "../../../use-case/auth/register.js";
import { LoginUser, LoginUserInput } from "../../../use-case/auth/login.js";
import { LogoutUser } from "../../../use-case/auth/logout.js";

export interface UserController {
    register(req: Request, res: Response): Promise<void>;
    logout(req: AuthenticatedRequest, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
}

export class AuthController {

    private registerUser: RegisterUser;
    private loginUser: LoginUser;
    private logoutUser: LogoutUser;


    constructor(userRepository: IUserRepository, notificationController: NotificationController,
        idleScheduler: IdleScheduler) {
        this.registerUser = new RegisterUser(userRepository);
        this.loginUser = new LoginUser(userRepository, notificationController);
        this.logoutUser = new LogoutUser(userRepository, idleScheduler, notificationController);
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const input: RegisterUserInput = req.body;
            const { user, token } = await this.registerUser.execute(input);
            res.status(201).json({
                id: user.getId(),
                email: user.getEmail(),
                displayName: user.getDisplayName(),
                userName: user.getUsername(),
                dateOfBirth: user.getDateOfBirth(),
                phoneNumber: user.getPhoneNumber(),
                status: user.getStatus(),
                access_token: token,
                message: "Account register successfully",
            });
        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).json({ errors: error.errors });
            } else {
                res.status(400).json({ error: (error as Error).message });
            }
        }
    }


    async login(req: Request, res: Response): Promise<void> {
        try {
            const input: LoginUserInput = req.body
            const { user, token } = await this.loginUser.execute(input);
            res.status(200).json({
                id: user.getId(),
                email: user.getEmail(),
                displayName: user.getDisplayName(),
                userName: user.getUsername(),
                dateOfBirth: user.getDateOfBirth(),
                phoneNumber: user.getPhoneNumber(),
                status: user.getStatus(),
                access_token: token,
                message: "User login successfully"
            });
        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).json({ errors: error.errors });
            } else {
                res.status(400).json({ error: (error as Error).message });
            }
        }
    }

    async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('User not found');
            await this.logoutUser.execute(userId)
            res.status(200).json({ message: 'User logged out successfully' });
        } catch (error) {
            console.error('Error logging out user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


}

