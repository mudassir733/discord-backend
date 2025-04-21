import { User } from "../entities/user.js";


export interface IUserRepository {
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByUserName(userName: string): Promise<User | null>;
    findByPhoneNumber(phoneNumber: string): Promise<User | null>;
    findByEmailOrPhoneNumber(identifier: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updatePassword(userId: string, hashPassword: string): Promise<void>;
}