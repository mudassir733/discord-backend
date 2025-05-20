export class Friendship {
    private id: string;
    private user1Id: string;
    private user2Id: string;
    private createdAt: Date;


    constructor(
        id: string,
        user1Id: string,
        user2Id: string,
        createdAt: Date,
    ) {
        this.id = id;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.createdAt = createdAt;
    }

    getId(): string { return this.id; }
    getUser1Id(): string { return this.user1Id; }
    getUser2Id(): string { return this.user2Id; }
    getCreatedAt(): Date { return this.createdAt; }
}