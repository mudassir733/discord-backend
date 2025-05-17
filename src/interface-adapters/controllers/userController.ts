import { Request, Response } from "express";
import { RegisterUser, RegisterUserInput } from "../../use-case/registerUser.js";
import { LoginUser, LoginUserInput } from "../../use-case/loginUser.js";
import { IUserRepository } from "../../use-case/IUserRepository.js";
import { GetAllUsersUseCase } from "../../use-case/getAllUser.js";
import { GetUserById } from "../../use-case/getUserById.js";
import { ZodError } from "zod";

export interface UserController {
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
}

export class UserController {

    private registerUser: RegisterUser;
    private loginUser: LoginUser;
    private getUsersById: GetUserById;
    private getAllUsers: GetAllUsersUseCase;

    constructor(userRepository: IUserRepository) {
        this.registerUser = new RegisterUser(userRepository);
        this.loginUser = new LoginUser(userRepository);
        this.getUsersById = new GetUserById(userRepository);
        this.getAllUsers = new GetAllUsersUseCase(userRepository);
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

