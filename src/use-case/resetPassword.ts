import { IUserRepository } from './IUserRepository.js';
import { prisma } from "../config/database.js"
import * as bcrypt from 'bcrypt';
import { z } from 'zod';

const resetPasswordSchema = z.object({
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export interface ResetPasswordInput {
    userId: string;
    password: string;
}

export class ResetPassword {
    constructor(private userRepository: IUserRepository) { }

    async execute(input: ResetPasswordInput): Promise<void> {
        const validatedInput = resetPasswordSchema.parse(input);
        const hashedPassword = await bcrypt.hash(validatedInput.password, 10);
        await this.userRepository.updatePassword(input.userId, hashedPassword);

        // Invalidate all reset tokens for this user
        await prisma.passwordResetToken.deleteMany({
            where: { userId: input.userId },
        });
    }
}