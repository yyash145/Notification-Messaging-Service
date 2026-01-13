import { User } from '../../database/entities/user.entity';
export declare class UsersService {
    private users;
    findByEmail(email: string): Promise<User | undefined>;
    create(user: User): Promise<User>;
}
