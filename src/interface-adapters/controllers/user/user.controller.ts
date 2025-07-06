import { Request, Response } from "express";
import { IUserRepository } from "../../../interfaces/IUserRepository.js";
import { GetAllUsersUseCase } from "../../../use-case/user/getAllUser.js";
import { GetUserById } from "../../../use-case/user/getUserById.js";
import { AuthenticatedRequest } from "../../../middleware/authMiddleware.js";

export interface UserController {
    register(req: Request, res: Response): Promise<void>;
    logout(req: AuthenticatedRequest, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
}

export class UserController {
    private getUsersById: GetUserById;
    private getAllUsers: GetAllUsersUseCase;

    constructor(userRepository: IUserRepository) {
        this.getUsersById = new GetUserById(userRepository);
        this.getAllUsers = new GetAllUsersUseCase(userRepository);
    }


    async getUserById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const user = await this.getUsersById.execute(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(user.toJSON());
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAllUser(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.getAllUsers.execute()
            if (!users) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            const userJson = users.map(user => user.toJSON())
            res.status(200).json(userJson)
        } catch (error) {
            console.error('Error fetching user by ID:', error);
        }
    }
}

