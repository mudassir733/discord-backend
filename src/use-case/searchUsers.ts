import { User } from '../entities/user.js';
import { IUserRepository } from './IUserRepository.js';

export class SearchUsersUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(query: string, currentUserId: string): Promise<User[]> {
        return await this.userRepository.searchByUsername(query, currentUserId);
    }
}