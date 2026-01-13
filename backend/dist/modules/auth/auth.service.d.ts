import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signup(email: string, password: string): Promise<{
        accessToken: string;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
    }>;
    private generateToken;
}
