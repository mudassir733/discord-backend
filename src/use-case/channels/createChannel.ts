import { DiscordRepository } from "../../interface-adapters/repositories/disordRepository.js";


export class CreateChannel {
    constructor(private discordRepository: DiscordRepository) { }

    async execute(guildId: string, channelName: string): Promise<void> {
        await this.discordRepository.createChannel(guildId, channelName);
    }
}
