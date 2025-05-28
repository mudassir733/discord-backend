
import { IFriendshipRepository } from '../../interfaces/IFriendshipRepository.js';
import { Friendship } from '../../entities/friendship.js';
import { prisma } from '../../config/database.js';

export class FriendshipRepository implements IFriendshipRepository {
    async save(friendship: Friendship): Promise<Friendship> {
        const savedFriendship = await prisma.friendship.create({
            data: {
                id: friendship.getId(),
                user1Id: friendship.getUser1Id(),
                user2Id: friendship.getUser2Id(),
                createdAt: friendship.getCreatedAt(),
            },
        });
        return new Friendship(
            savedFriendship.id,
            savedFriendship.user1Id,
            savedFriendship.user2Id,
            savedFriendship.createdAt
        );
    }

    async findByUserIds(userId1: string, userId2: string): Promise<Friendship | null> {
        const friendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: userId1, user2Id: userId2 },
                    { user1Id: userId2, user2Id: userId1 },
                ],
            },
        });
        if (!friendship) return null;
        return new Friendship(friendship.id, friendship.user1Id, friendship.user2Id, friendship.createdAt);
    }

    async findByUserId(userId: string): Promise<Friendship[]> {
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [{ user1Id: userId }, { user2Id: userId }],
            },
            select: {
                id: true,
                user1Id: true,
                user2Id: true,
                createdAt: true,
            }
        });
        return friendships.map(f => new Friendship(f.id, f.user1Id, f.user2Id, f.createdAt));
    }
}