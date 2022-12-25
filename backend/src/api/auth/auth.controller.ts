import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Res,
  Req,
  UseInterceptors,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LoginReqDto } from 'src/api/user/dto/login-req.dto';
import { UserRepository } from 'src/core/user/user.repository';
import { UserStatus } from 'src/enum/user-status';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';

const multerOptions = {
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException('이미지 형식은 jpg, jpeg, png만 허용'),
        false,
      );
    }
  },

  storage: diskStorage({
    filename: (request, file, callback) => {
      const filename = file.originalname.split('.');
      const editName = `${Date.now()}_${request.query.email}.${
        filename[filename.length - 1]
      }`;
      callback(null, editName);
    },
    destination: (request, file, callback) => {
      const uploadPath = 'upload';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      callback(null, uploadPath);
    },
  }),

  limits: {
    fileSize: 1024 * 1024 * 5, // 10 Mb
  },
};

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {}

  @Post('/signup')
  @UseInterceptors(FileInterceptor('profileImage', multerOptions))
  async signup(
    @Query() userInfo,
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res,
  ) {
    console.log(file);
    const user = this.authService.signUpUser(
      userInfo.username,
      userInfo.email,
      file?.filename ?? null,
    );
    const token = await this.authService.getToken(user);
    res.cookie('jwt', token.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return { ...user, ...token };
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiConsumes('application/json')
  @ApiBody({ type: LoginReqDto })
  async login(@Req() req, @Res({ passthrough: true }) res) {
    const user = req.user;
    if (user.firstLogin) {
      return user;
    }
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
  @Post('logout')
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
}
