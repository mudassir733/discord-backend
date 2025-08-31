import { User } from '../../entities/user.js';
import { IUserRepository } from '../../interfaces/IUserRepository.js';


export class SearchUsersUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(query: string, currentUserId: string): Promise<User[]> {
        if (!query) return [];
        return await this.userRepository.searchByUsername(query, currentUserId);
    }
}