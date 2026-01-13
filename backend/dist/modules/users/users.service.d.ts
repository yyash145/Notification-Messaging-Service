import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
export declare class UsersService {
    private repo;
    private users;
    constructor(repo: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(user: Partial<User>): Promise<User>;
    save(user: User): Promise<User>;
}
