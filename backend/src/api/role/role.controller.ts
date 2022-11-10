import { Controller, Post, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from '../../core/role/role.entity';

@Controller('test')
export class RoleController {
  constructor(private RoleService: RoleService) {}

  @Get()
  getRoles(): Promise<Role[]> {
    return this.RoleService.getRoles();
  }

  @Post()
  createRole(): Promise<Role> {
    return this.RoleService.createRole();
  }
}
