import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('/user')
  // userMake() { }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  loginUser(@Request() req) {
    console.log(`sdfsdf:`);
    console.log(req.user);
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // @Post('/logout')
  // logoutUser() { }
}
