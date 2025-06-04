import { prisma } from "../../../config/database.js"
import { ChannelMembers } from "../../../entities/chats/channelMembers.js"
import { IChannelMembersRepository } from "../../../interfaces/chats-interfaces/IChannelMemeberRepository.js"


export class ChannelMemebersRepository implements IChannelMembersRepository {
    async create(channelId: string, userId: string): Promise<ChannelMembers> {
        const member = await prisma.channelMembers.create({
            data: { channelId, userId }
        })
        return new ChannelMembers(member.channelId, member.userId)
    }

    async findChannelAndUser(channelId: string, userId: string): Promise<ChannelMembers | null> {
        const member = await prisma.channelMembers.findUnique({
            where: {
                channelId_userId: { userId, channelId }
            }
        })
        return member ? new ChannelMembers(member.channelId, member.userId) : null
    }


    async findChannelByUserId(userId: string): Promise<ChannelMembers[]> {
        const channelMembers = await prisma.channelMembers.findMany({
            where: {
                userId
            }
        })
        return channelMembers.map(member => new ChannelMembers(member.channelId, member.userId))
    }


}