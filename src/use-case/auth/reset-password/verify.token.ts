import { prisma } from '../../../config/database.js';

export interface VerifyResetTokenInput {
    token: string;
}

export class VerifyResetToken {
    async execute(input: VerifyResetTokenInput): Promise<string> {
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token: input.token },
        });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new Error('Invalid or expired token');
        }

        return resetToken.userId;
    }
}