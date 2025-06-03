export class Messages {
    private id: string;
    private content: string;
    private senderId: string;
    private channelId: string;
    private createAt: Date;

    constructor(id: string, content: string, senderId: string, channelId: string, createAt: Date) {
        this.id = id
        this.content = content
        this.senderId = senderId
        this.channelId = channelId
        this.createAt = createAt
    }

    getId(): string {
        return this.id
    }

    getContent(): string {
        return this.content
    }

    getChannelId(): string {
        return this.channelId
    }
    getCreateAt(): Date {
        return this.createAt
    }
    getSenderId(): string {
        return this.senderId
    }
}


