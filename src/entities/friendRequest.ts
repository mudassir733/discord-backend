export class FriendRequest {
    private id: string;
    private senderId: string;
    private receiverId: string;
    private status: 'pending' | 'accepted' | 'rejected';
    private createdAt: Date;

    constructor(
        id: string,
        senderId: string,
        receiverId: string,
        status: 'pending' | 'accepted' | 'rejected',
        createdAt: Date
    ) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.status = status;
        this.createdAt = createdAt;
    }

    getId(): string { return this.id; }
    getSenderId(): string { return this.senderId; }
    getReceiverId(): string { return this.receiverId; }
    getStatus(): 'pending' | 'accepted' | 'rejected' { return this.status; }
    getCreatedAt(): Date { return this.createdAt; }
    setStatus(status: 'pending' | 'accepted' | 'rejected'): void {
        this.status = status;
    }
}