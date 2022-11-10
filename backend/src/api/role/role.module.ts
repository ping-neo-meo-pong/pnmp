import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from '../../core/role/role.repository';
import { Role } from '../../core/role/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmExModule } from '../../typeorm-ex.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    TypeOrmExModule.forCustomRepository([RoleRepository]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
