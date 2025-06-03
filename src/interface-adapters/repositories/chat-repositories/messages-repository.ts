import { prisma } from "../../../config/database.js"
import { Messages } from "../../../entities/chats/messages.js"
import { IMessageRepository } from "../../../interfaces/chats-interfaces/IMessageRepository.js"


export class MessageRepository implements IMessageRepository {
    async create(content: string, channelId: string, senderId: string): Promise<Messages> {
        const message = await prisma.message.create({
            data: {
                content,
                channelId,
                senderId
            }
        })
        return new Messages(message.id, message.content, message.channelId, message.senderId, message.createdAt)
    }

    async findByChannelId(channelId: string, limit: number, offset: number): Promise<Messages[]> {
        const message = await prisma.message.findMany({
            where: { channelId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        })
        return message.map(m => new Messages(m.id, m.content, m.channelId, m.senderId, m.createdAt))

    }


}