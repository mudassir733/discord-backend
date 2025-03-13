import { User } from "../entities/user";
import { IUserRepository } from "./IUserRepository";
import * as bcrypt from "bcrypt";

export interface RegisterUserInput {
    email: string;
    userName: string;
    displayName: string;
    phoneNumber?: string;
    password: string;
    dateOfBirth: Date;
}


export const registerUser = (userRepository: IUserRepository) => {
    return async (input: RegisterUserInput): Promise<User> => {
        // validate input
        if (!input.email || !input.password || !input.userName || !input.displayName || !input.dateOfBirth) {
            throw new Error("All fields are required except PhoneNumber!");
        }


        // check existing user
        const existingUser = await userRepository.findByEmail(input.email)
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

    }

}