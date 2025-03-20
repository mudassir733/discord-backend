import { User } from "../entities/user.js";
import { IUserRepository } from "./IUserRepository.js";
import * as bcrypt from "bcrypt"

export interface RegisterUserInput {
    email: string;
    userName: string;
    displayName: string;
    phoneNumber?: string;
    password: string;
    dateOfBirth: Date;
}


export class RegisterUser {
    constructor(private userRepository: IUserRepository) { }
    async execute(input: RegisterUserInput): Promise<User> {
        // validate input
        if (!input.email || !input.password || !input.userName || !input.displayName || !input.dateOfBirth) {
            throw new Error("All fields are required except PhoneNumber!");
        }

        // check existing user
        const existingEmail = await this.userRepository.findByEmail(input.email);
        if (existingEmail) throw new Error("User with this email already exists");

        const existingUserName = await this.userRepository.findByUserName(input.userName);
        if (existingUserName) throw new Error("User name already exist");

        if (input.phoneNumber) {
            const existingPhoneNumber = await this.userRepository.findByPhoneNumber(input.phoneNumber);
            if (existingPhoneNumber) throw new Error("User with this phone number already exists");

        }
        //hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // create new User
        const user = new User(
            input.email,
            input.displayName,
            input.userName,
            hashedPassword,
            input.dateOfBirth,
            input.phoneNumber
        );

        // save user
        return await this.userRepository.save(user)

    }

}