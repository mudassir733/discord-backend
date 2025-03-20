import { IUserRepository } from "./IUserRepository.js";
import { User } from "../entities/user.js";
import * as bcrypt from "bcrypt";


export interface LoginUserInput {
    identifier: string,
    password: string
}


export class LoginUser {
    constructor(private userRepository: IUserRepository) { }
    async execute(input: LoginUserInput): Promise<User> {
        const user = await this.userRepository.findByEmailOrPhoneNumber(input.identifier)
        if (!user) throw new Error("Couldn't find user with this email or phone number")

        const comparePassword = await bcrypt.compare(input.password, user.getPassword());
        if (!comparePassword) throw new Error("Incorrect password");

        return user;
    }
}