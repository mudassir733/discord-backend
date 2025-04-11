import { Request, Response } from "express";
import { RegisterUser, RegisterUserInput } from "../../use-case/registerUser.js";
import { LoginUser, LoginUserInput } from "../../use-case/loginUser.js";
import { IUserRepository } from "../../use-case/IUserRepository.js";
import { ZodError } from "zod";

export interface UserController {
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
}

export class UserController {

    private registerUser: RegisterUser;
    private loginUser: LoginUser;

    constructor(userRepository: IUserRepository) {
        this.registerUser = new RegisterUser(userRepository);
        this.loginUser = new LoginUser(userRepository);
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
            });
        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).json({ errors: error.errors });
            } else {
                res.status(400).json({ error: (error as Error).message });
            }
        }
    }
}

