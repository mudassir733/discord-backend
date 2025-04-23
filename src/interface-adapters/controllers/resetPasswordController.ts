import { Request, Response } from 'express';
import { InitiatePasswordResetForLoggedInUser } from '../../use-case/initiatePasswordResetForLoggedInUser.js';
import { VerifyResetToken, VerifyResetTokenInput } from '../../use-case/verifyToken.js';
import { ResetPassword, ResetPasswordInput } from '../../use-case/resetPassword.js';
import { IUserRepository } from '../../use-case/IUserRepository.js';
import { ZodError } from 'zod';

export class ResetPasswordController {
    private initiateReset: InitiatePasswordResetForLoggedInUser;
    private verifyToken: VerifyResetToken;
    private resetPassword: ResetPassword;

    constructor(userRepository: IUserRepository) {
        this.initiateReset = new InitiatePasswordResetForLoggedInUser(userRepository);
        this.verifyToken = new VerifyResetToken();
        this.resetPassword = new ResetPassword(userRepository);
    }

    async initiateResetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body
            console.log('Controller userId:', email)
            if (!email) throw new Error("Email is required for reset your password")
            await this.initiateReset.execute({ email })
            res.status(200).json({ message: `To reset your password we have sent an email at ${email} please check your email` });
        } catch (error: any) {
            console.error('Initiate reset error:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async verifyResetToken(req: Request, res: Response): Promise<void> {
        try {
            const input: VerifyResetTokenInput = req.body;
            const userId = await this.verifyToken.execute(input);
            res.status(200).json({ userId });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async resetPasswords(req: Request, res: Response): Promise<void> {
        try {
            const input: ResetPasswordInput = req.body;
            await this.resetPassword.execute(input);
            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).json({ errors: error.errors });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }
}