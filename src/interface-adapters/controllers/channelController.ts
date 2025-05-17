import { Request, Response } from 'express';
import { CreateChannel } from '../../use-case/createChannel.js';

export class ChannelController {
    constructor(private createChannelUseCase: CreateChannel) { }

    async createChannel(req: Request, res: Response): Promise<void> {
        try {
            const { guildId, channelName } = req.body;
            if (!guildId || !channelName) {
                res.status(400).json({ error: 'guildId and channelName are required' });
                return;
            }
            await this.createChannelUseCase.execute(guildId, channelName);
            res.status(200).json({ message: `Channel "${channelName}" created in guild ${guildId}` });
        } catch (error: any) {
            console.error('Create channel error:', error);
            res.status(500).json({ error: error.message || 'Failed to create channel' });
        }
    }
}