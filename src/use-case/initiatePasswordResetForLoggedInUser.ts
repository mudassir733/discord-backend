import { IUserRepository } from "./IUserRepository.js";
import { v4 as uuidv4 } from "uuid"
import { prisma } from "../config/database.js"
import { sendPasswordResetEmail } from "../utils/emailService.js";


export interface InitiatePasswordResetInput {
    email: string
}

export class InitiatePasswordResetForLoggedInUser {
    constructor(private userRepository: IUserRepository) { }

    async execute(input: InitiatePasswordResetInput): Promise<void> {
        console.log('Initiate reset for Email:', input.email);
        const user = await this.userRepository.findByEmail(input.email)

        if (!user) throw new Error("User not found!")

        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);


        await prisma.passwordResetToken.create({
            data: {
                userId: user.getId()!,
                token,
                expiresAt,
            },
        });

        await sendPasswordResetEmail(user.getEmail(), token);
    }
}