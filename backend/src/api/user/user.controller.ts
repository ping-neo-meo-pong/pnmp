import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../core/user/user.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findUsers(): Promise<User[]> {
    return this.userService.findUsers();
  }

  /*
  @Get(':id')
  findUser(@Param('id') userId: string) {}

  @Patch(':id')
  modifyUser(@Param('id') userId: string) {}

  @Get('/friend')
  findFriend(@Param('id') userId: string) {}

  @Post('/friend/:friend-id')
  requestFriend(@Param('friend-id') friendId: string) {}

  @Patch('/friend/:friend-id')
  acceptFriend(@Param('friend-id') friendId: string) {}

  @Delete('/friend/:friend-id')
  deleteFriend(@Param('frined-id') friendId: string) {}

  @Post('/block/:block-id')
  userBlock(@Param('block-id') blockId: string) {}

  @Patch('/block/:block-id')
  liftBlockUser(@Param('block-id') blockId: string) {}
  */
}
