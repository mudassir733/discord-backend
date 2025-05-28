import { IUserRepository, FriendRequest } from "../../interfaces/IUserRepository.js";
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
                dateOfBirth: user.getDateOfBirth(),
                status: user.getStatus(),
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
            createdUser.status as 'offline' | 'online' | 'idle',
        )
        return newUser
    }

    async searchByUsername(query: string, excludeUserId: string): Promise<User[]> {
        const users = await prisma.user.findMany({
            where: {
                userName: {
                    contains: query,
                    mode: 'insensitive'
                },
                NOT: {
                    id: excludeUserId
                }
            }
        });

        return users.map(user => new User(
            user.id,
            user.email,
            user.displayName,
            user.userName || '',
            '',
            user.dateOfBirth,
            user.profilePicture || '',
            user.phoneNumber || '',
            user.status as 'offline' | 'online' | 'idle',
            user.lastActive || new Date()
        ));

    }


    async getIncomingFriendRequests(userId: string): Promise<FriendRequest[]> {
        const friendRequests = await prisma.friendRequest.findMany({
            where: {
                receiverId: userId,
                status: 'pending'
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        userName: true,
                        displayName: true,
                        profilePicture: true,
                    }
                }
            }
        });

        return friendRequests.map(request => ({
            id: request.id,
            senderId: request.senderId,
            senderUsername: request.sender.userName || '',
            senderDisplayName: request.sender.displayName,
            senderProfilePicture: request.sender.profilePicture,
            status: request.status,
            createdAt: request.createdAt
        }));
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
        if (!user) return null;
        return new User(
            user.id,
            user.email,
            user.displayName,
            user.userName || '',
            '',
            user.dateOfBirth,
            user.profilePicture || '',
            user.phoneNumber || '',
            user.status as 'offline' | 'online' | 'idle',
            user.lastActive || new Date()
        );
    }

    async updateUserStatus(userId: string, status: string): Promise<void> {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                status,
                lastActive: new Date()
            },
        });
        if (!user) throw new Error('User not found');

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
            user.profilePicture || '',
            user.phoneNumber || '',
            user.status as 'offline' | 'online' | 'idle',
            user.lastActive = new Date()

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