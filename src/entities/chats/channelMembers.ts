export class ChannelMembers {
    private channelId: string
    private userId: string;


    constructor(channelId: string, userId: string) {
        this.channelId = channelId;
        this.userId = userId;
    }

    getChannelId(): string {
        return this.channelId;
    }

    getUserId(): string {
        return this.userId;
    }
}