export class User {
    id?: number;
    email: string;
    phoneNumber?: string;
    displayName: string;
    userName: string;
    password: string;
    dateOfBirth: Date;

    constructor(id: number, email: string, phoneNumber: string, displayNumber: string, userName: string, password: string, dateOfBirth: Date) {
        this.id = id;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.displayName = displayNumber;
        this.userName = userName;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
    }
}