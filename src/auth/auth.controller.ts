import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body('email') email: string, @Body('pw') pw: string) {
    return this.authService.login(email, pw);
  }
}
