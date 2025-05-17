import { IUserRepository } from "../../use-case/IUserRepository.js";
import { User } from "../../entities/user.js";
import { prisma } from "../../config/database.js";




export class UserRepository implements IUserRepository {
    async save(user: User): Promise<User> {
        const createdUser = await prisma.user.create({
            data: {
                id: user.getId(),
                email: user.getEmail(),
                phoneNumber: user.getPhoneNumber(),
                displayName: user.getDisplayName(),
                userName: user.getUsername(),
                password: user.getPassword(),
                dateOfBirth: user.getDateOfBirth()
            }
        })
        const newUser = new User(
            createdUser.id,
            createdUser.email,
            createdUser.displayName,
            createdUser.userName || '',
            createdUser.password,
            createdUser.dateOfBirth,
            createdUser.phoneNumber || '',
        )
        return newUser
    }



    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null
        return new User(
            user.id,
            user.email,
            user.displayName,
            user.userName || '',
            user.password,
            user.dateOfBirth,
            user.phoneNumber || '',
        )
    }
    async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { phoneNumber } })
        if (!user) return null
        return new User(
            user.id,
            user.email,
            user.displayName,
            user.userName || '',
            user.password,
            user.dateOfBirth,
            user.phoneNumber || '',
        )

    }
    async findByUserName(userName: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { userName } })
        if (!user) return null
        return new User(
            user.id,
            user.email,
            user.displayName,
            user.userName || '',
            user.password,
            user.dateOfBirth,
            user.phoneNumber || '',
        )

    }
    async findByEmailOrPhoneNumber(identifier: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { phoneNumber: identifier }],
            },
        });
        if (!user) return null;
        return new User(
            user.id,
            user.email,
            user.displayName,
            user.userName || '',
            user.password,
            user.dateOfBirth,
            user.phoneNumber || '',
        );
    }


    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { id } });
        console.log('Finding user by ID:', id);
        if (!user) return null;
        return new User(
            user.id,
            user.email,
            user.displayName,
            '',
            user.userName || '',
            user.dateOfBirth,
            user.phoneNumber || ''
        );
    }


    async findAll(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users.map(user => new User(
            user.id,
            user.email,
            user.displayName,
            user.userName || '',
            '',
            user.dateOfBirth,
            user.phoneNumber || ''
        ))
    }


    async updatePassword(userId: string, hashedPassword: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }

    async updatePasswordByEmail(email: string, hashedPassword: string): Promise<void> {
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
    }


}