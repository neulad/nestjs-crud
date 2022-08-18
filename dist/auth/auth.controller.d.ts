import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(email: string, pw: string): Promise<{
        acces_token: string;
    }>;
}
