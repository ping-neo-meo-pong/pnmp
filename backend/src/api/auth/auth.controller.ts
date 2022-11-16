import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Res,
  Body,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req, @Res({ passthrough: true }) res) {
    console.log(`auth.controller login`);
    const user = req.user;
    const token = await this.authService.getToken(user);
    // res.setHeader('Authorization', 'Bearer ' + token.accessToken);
    res.cookie('jwt', token.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return { ...user, ...token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // @Post('/logout')
  // logoutUser() { }
}
