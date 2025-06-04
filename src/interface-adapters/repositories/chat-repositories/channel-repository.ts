import { prisma } from "../../../config/database.js"
import { IChannelRepository } from "../../../interfaces/chats-interfaces/IChannelRepository.js"
import { Channel } from "../../../entities/chats/channels.js"


export class ChannelRepository implements IChannelRepository {
    async create(isDirect: boolean, name?: string): Promise<Channel> {
        const channel = await prisma.channel.create({
            data: { isDirect, name }
        })
        return new Channel(channel.id, channel.isDirect as false, channel.name as string)
    }

    async findById(id: string): Promise<Channel | null> {
        const channel = await prisma.channel.findUnique({
            where: {
                id: id
            }
        })
        return channel ? new Channel(channel.id, channel.isDirect as false, channel.name as string) : null
    }

    async findDirectChannelBetweenUsers(user1Id: string, user2Id: string): Promise<Channel | null> {
        const channel = await prisma.channel.findFirst({
            where: {
                isDirect: true,
                members: {
                    every: {
                        userId: { in: [user1Id, user2Id] }
                    }
                },
            },
            include: { members: true },
        });

        if (channel && channel.members.length === 2) {
            return new Channel(channel.id, channel.isDirect as false, channel.name as string)

        }
        return null;
    }


}