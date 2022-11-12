import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
// import { AuthGuard } from 'passport-local';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('/user')
  // userMake() { }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  loginUser(@Request() req) {
    console.log(req.user_id);
    return this.authService.login(req.user);
  }

  // @Post('/logout')
  // logoutUser() { }
}
