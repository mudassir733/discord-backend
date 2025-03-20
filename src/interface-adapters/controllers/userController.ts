import { Request, Response } from "express";
import { RegisterUser, RegisterUserInput } from "../../use-case/registerUser.js";
import { LoginUser, LoginUserInput } from "../../use-case/loginUser.js";
import { IUserRepository } from "../../use-case/IUserRepository.js";

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
            const input: RegisterUserInput = {
                email: req.body.email,
                displayName: req.body.displayName,
                userName: req.body.userName,
                password: req.body.password,
                dateOfBirth: new Date(req.body.dateOfBirth),
                phoneNumber: req.body.phoneNumber,
            };
            const user = await this.registerUser.execute(input);
            res.status(201).json({
                id: user.getId(),
                email: user.getEmail(),
                displayName: user.getDisplayName(),
                userName: user.getUsername(),
                dateOfBirth: user.getDateOfBirth(),
                phoneNumber: user.getPhoneNumber(),
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }


    async login(req: Request, res: Response): Promise<void> {
        try {
            const input: LoginUserInput = {
                identifier: req.body.identifier,
                password: req.body.password,
            };
            const user = await this.loginUser.execute(input);
            res.status(200).json({
                id: user.getId(),
                email: user.getEmail(),
                displayName: user.getDisplayName(),
                userName: user.getUsername(),
                dateOfBirth: user.getDateOfBirth(),
                phoneNumber: user.getPhoneNumber(),
            });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}

