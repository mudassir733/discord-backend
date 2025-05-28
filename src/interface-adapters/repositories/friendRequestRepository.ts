import { IFriendRequestRepository, SentFriendRequest } from '../../interfaces/IFriendRequestRepository.js';
import { FriendRequest } from '../../entities/friendRequest.js';
import { prisma } from '../../config/database.js';

export class FriendRequestRepository implements IFriendRequestRepository {
    async save(friendRequest: FriendRequest): Promise<FriendRequest> {
        const savedRequest = await prisma.friendRequest.upsert({
            where: { id: friendRequest.getId() },
            update: { status: friendRequest.getStatus() },
            create: {
                id: friendRequest.getId(),
                senderId: friendRequest.getSenderId(),
                receiverId: friendRequest.getReceiverId(),
                status: friendRequest.getStatus(),
                createdAt: friendRequest.getCreatedAt(),
            },
        });
        return new FriendRequest(
            savedRequest.id,
            savedRequest.senderId,
            savedRequest.receiverId,
            savedRequest.status as 'pending' | 'accepted' | 'rejected',
            savedRequest.createdAt
        );
    }

    async findById(id: string): Promise<FriendRequest | null> {
        const request = await prisma.friendRequest.findUnique({ where: { id } });
        if (!request) return null;
        return new FriendRequest(
            request.id,
            request.senderId,
            request.receiverId,
            request.status as 'pending' | 'accepted' | 'rejected',
            request.createdAt
        );
    }

    async findPendingBySenderAndReceiver(senderId: string, receiverId: string): Promise<FriendRequest | null> {
        const request = await prisma.friendRequest.findFirst({
            where: { senderId, receiverId, status: 'pending' },
        });
        if (!request) return null;
        return new FriendRequest(
            request.id,
            request.senderId,
            request.receiverId,
            request.status as 'pending' | 'accepted' | 'rejected',
            request.createdAt
        );
    }

    async findRejectedBySenderAndReceiver(senderId: string, receiverId: string): Promise<FriendRequest | null> {
        const request = await prisma.friendRequest.findFirst({
            where: {
                senderId,
                receiverId,
                status: 'rejected',
            },
        });
        if (!request) return null;
        return new FriendRequest(
            request.id,
            request.senderId,
            request.receiverId,
            request.status as 'rejected',
            request.createdAt
        );
    }


    async getSentFriendRequests(senderId: string): Promise<SentFriendRequest[]> {
        const friendRequests = await prisma.friendRequest.findMany({
            where: {
                senderId,
                status: 'pending',
            },
            include: {
                receiver: {
                    select: {
                        id: true,
                        userName: true,
                        displayName: true,
                        profilePicture: true
                    },
                },
            },
        });

        return friendRequests.map(request => ({
            id: request.id,
            receiverId: request.receiverId,
            receiverUsername: request.receiver.userName || '',
            receiverDisplayName: request.receiver.displayName,
            profilePicture: request.receiver.profilePicture,
            status: request.status as 'pending' | 'accepted' | 'rejected',
            createdAt: request.createdAt,
        }));
    }
}