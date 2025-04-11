import { IUserRepository } from "./IUserRepository.js";
import { User } from "../entities/user.js";
import * as bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";


const loginSchema = z.object({
    identifier: z.string().min(1),
    password: z.string().min(6, { message: "password must be at least 6 characters long" }),
})

export interface LoginUserInput {
    identifier: string,
    password: string
}


export class LoginUser {
    constructor(private userRepository: IUserRepository) { }
    async execute(input: LoginUserInput): Promise<{ user: User, token: string }> {

        const validateInput = loginSchema.parse(input);


        const user = await this.userRepository.findByEmailOrPhoneNumber(validateInput.identifier)
        if (!user) throw new Error("Couldn't find user with this email or phone number")

        const comparePassword = await bcrypt.compare(validateInput.password, user.getPassword());
        if (!comparePassword) throw new Error("Incorrect password");


        const payload = {
            sub: user.getId(),
            email: user.getEmail(),
            username: user.getUsername(),
            displayName: user.getDisplayName()
        }

        const secret = process.env.JWT_SECRET_KEY!

        const token = await jwt.sign(payload, secret, { expiresIn: "1h" })

        return {
            user,
            token
        };
    }
}