
import { User } from "../../entities/user.js";
import { IUserRepository } from "../../interfaces/IUserRepository.js";


export class GetUserById {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

}