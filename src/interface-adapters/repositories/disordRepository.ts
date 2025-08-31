import { Client, GatewayIntentBits, TextChannel } from "discord.js";



export class DiscordRepository {
    private client: Client
    constructor() {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
        });
    }

    async login(token: string): Promise<void> {
        await this.client.login(token)
    }
    async createChannel(guildId: string, channelName: string): Promise<TextChannel> {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) throw new Error('Guild not found');
        return await guild.channels.create({ name: channelName, type: 0 });
    }

    onMessage(callback: (message: any) => void): void {
        this.client.on('messageCreate', callback);
    }

}