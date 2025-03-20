// src/entities/User.ts
export class User {
    private id?: number;
    private email: string;
    private phoneNumber?: string;
    private displayName: string;
    private username: string;
    private password: string;
    private dateOfBirth: Date;

    constructor(
        email: string,
        displayName: string,
        username: string,
        password: string,
        dateOfBirth: Date,
        phoneNumber?: string,
        id?: number
    ) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.displayName = displayName;
        this.username = username;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.id = id;
    }

    // Getters
    getId(): number | undefined { return this.id; }
    getEmail(): string { return this.email; }
    getPhoneNumber(): string | undefined { return this.phoneNumber; }
    getDisplayName(): string { return this.displayName; }
    getUsername(): string { return this.username; }
    getPassword(): string { return this.password; }
    getDateOfBirth(): Date { return this.dateOfBirth; }

    // Setter for ID (set by repository after saving)
    setId(id: number): void { this.id = id; }
}