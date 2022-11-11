import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../../core/user/user.repository';
import { User } from '../../core/user/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmExModule } from '../../typeorm-ex.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		TypeOrmExModule.forCustomRepository([UserRepository]),
	],
	controllers: [UserController],
	providers: [UserService],
})
export class GameRoomModule { }
