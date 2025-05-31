import { User } from "../../entities/user.js";
import { IUserRepository } from "../../interfaces/IUserRepository.js";
import * as bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import jwt from "jsonwebtoken";


const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    userName: z.string().min(3, { message: "UserName must be 3 or more characters long" }),
    displayName: z.string().min(1, { message: "DisplayName must be 1 or more characters long" }),
    phoneNumber: z.string().optional(),
    password: z.string().min(6, { message: "Password must be 6 or more characters long" }),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
})

export interface RegisterUserInput {
    email: string;
    userName: string;
    displayName: string;
    phoneNumber?: string;
    password: string;
    dateOfBirth: string;
    status: string;
}


export class RegisterUser {
    constructor(private userRepository: IUserRepository) { }
    async execute(input: RegisterUserInput): Promise<{ user: User; token: string }> {

        const validatedInput = registerSchema.parse(input)
        // validate input
        if (!input.email || !input.password || !input.userName || !input.displayName || !input.dateOfBirth) {
            throw new Error("All fields are required except PhoneNumber!");
        }

        // check existing user
        const existingEmail = await this.userRepository.findByEmail(validatedInput.email);
        if (existingEmail) throw new Error("User with this email already exists");

        const existingUserName = await this.userRepository.findByUserName(validatedInput.userName);
        if (existingUserName) throw new Error("User name already exist");

        if (validatedInput.phoneNumber) {
            const existingPhoneNumber = await this.userRepository.findByPhoneNumber(validatedInput.phoneNumber);
            if (existingPhoneNumber) throw new Error("User with this phone number already exists");

        }

        //hash password
        const hashedPassword = await bcrypt.hash(validatedInput.password, 10);

        const uuid = uuidv4();


        // create new User
        const user = new User(
            uuid,
            validatedInput.email,
            validatedInput.displayName,
            validatedInput.userName,
            hashedPassword,
            new Date(validatedInput.dateOfBirth),
            validatedInput.phoneNumber,
            input.status as 'offline' | 'online' | 'idle'
        );

        // save user
        const saveUser = await this.userRepository.save(user)
        const payload = {
            sub: saveUser.getId(),
            id: saveUser.getId(),
            email: saveUser.getEmail(),
            userName: saveUser.getUsername(),
            displayName: saveUser.getDisplayName(),
            status: saveUser.getStatus()
        }
        const secret = process.env.JWT_SECRET_KEY!
        const token = await jwt.sign(payload, secret, { expiresIn: "30d" })
        return { user: saveUser, token }

    }

}