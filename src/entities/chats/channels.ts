export class Channel {
    private id: string;
    private name?: string;
    private isDirect: false;


    constructor(
        id: string,
        isDirect: false,
        name?: string,
    ) {
        this.id = id;
        this.name = name;
        this.isDirect = isDirect;
    }

    getId(): string {
        return this.id;
    }
    getName(): string | undefined {
        return this.name;
    }
    isDirectChannel(): boolean {
        return this.isDirect;
    }
}


