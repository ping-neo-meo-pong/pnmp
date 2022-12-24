import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Res,
  Req,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LoginReqDto } from 'src/api/user/dto/login-req.dto';
import { OtpDto } from 'src/api/user/dto/otp.dto';
import { UserRepository } from 'src/core/user/user.repository';
import { UserStatus } from 'src/enum/user-status';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @ApiConsumes('application/json')
  @ApiBody({ type: LoginReqDto })
  async login(@Req() req, @Res({ passthrough: true }) res) {
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
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  @ApiBearerAuth()
  async logout(@Request() req, @Res({ passthrough: true }) res) {
    const user = await this.userRepository.findOneBy({ id: req.user.id });
    if (user && user.status != UserStatus.INGAME) {
      await this.userRepository.update(req.user.id, {
        status: UserStatus.OFFLINE,
      });
    }
    res.cookie('jwt', '', { httpOnly: true, maxAge: 0 });
    return { message: 'success' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('2fa-qrcode')
  @ApiBearerAuth()
  async get2faQrCode(@Req() req) {
    const user = await this.userRepository.findOneBy({ id: req.user.id });
    console.log(authenticator.generateSecret());
    const otpAuthUrl = authenticator.keyuri(req.user.id, 'PNMP', 'EVCDKZCJIJCQGOIW');
    console.log(otpAuthUrl);
    return toDataURL(otpAuthUrl);
  }

  @Post('2fa-otp')
  @ApiConsumes('application/json')
  @ApiBody({ type: OtpDto })
  async otpLogin(@Body() body) {
    console.log(body.otp);
    const isVerified = authenticator.verify({
      token: body.otp,
      secret: 'EVCDKZCJIJCQGOIW',
    });
    console.log(isVerified);
  }
}
