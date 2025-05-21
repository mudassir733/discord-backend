export class Notification {
    private id: string;
    private recipientId: string;
    private type: 'friend_request_sent' | 'friend_request_accepted' | 'friend_request_rejected';
    private message: string;
    private createdAt: Date;
    private read: boolean;

    constructor(
        id: string,
        recipientId: string,
        type: 'friend_request_sent' | 'friend_request_accepted' | 'friend_request_rejected',
        message: string,
        createdAt: Date,
        read: boolean = false
    ) {
        this.id = id;
        this.recipientId = recipientId;
        this.type = type;
        this.message = message;
        this.createdAt = createdAt;
        this.read = read;
    }
    getId(): string { return this.id; }
    getRecipientId(): string { return this.recipientId; }
    getType(): 'friend_request_sent' | 'friend_request_accepted' | 'friend_request_rejected' { return this.type; }
    getMessage(): string { return this.message; }
    getCreatedAt(): Date { return this.createdAt; }
    isRead(): boolean { return this.read; }
}