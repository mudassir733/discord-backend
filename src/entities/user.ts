// src/entities/User.ts
export class User {
    private id: string;
    private email: string;
    private phoneNumber?: string;
    private displayName: string;
    private username: string | null;
    private password: string;
    private dateOfBirth: Date;
    private status: 'offline' | 'online' | 'idle' = 'offline';
    private lastActive: Date;

    constructor(
        id: string,
        email: string,
        displayName: string,
        username: string,
        password: string,
        dateOfBirth: Date,
        phoneNumber?: string,
        status: 'offline' | 'online' | 'idle' = 'offline',
        lastActive: Date = new Date()
    ) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.displayName = displayName;
        this.username = username;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.id = id;
        this.status = status;
        this.lastActive = lastActive;
    }

    // Getters
    getId(): string | undefined { return this.id; }
    getEmail(): string { return this.email; }
    getPhoneNumber(): string | undefined { return this.phoneNumber; }
    getDisplayName(): string { return this.displayName; }
    getUsername(): string | null { return this.username; }
    getPassword(): string { return this.password; }
    getDateOfBirth(): Date { return this.dateOfBirth; }
    getStatus(): 'offline' | 'online' | 'idle' { return this.status; }
    // Setter for ID (set by repository after saving)
    setId(id: string): void { this.id = id; }
    // Setter for status
    setStatus(status: 'offline' | 'online' | 'idle'): void { this.status = status; }

    toJSON(): object {
        return {
            id: this.id,
            email: this.email,
            displayName: this.displayName,
            username: this.username,
            dateOfBirth: this.dateOfBirth,
            phoneNumber: this.phoneNumber,
            status: this.status,
            lastActive: this.lastActive,
        };
    }
}