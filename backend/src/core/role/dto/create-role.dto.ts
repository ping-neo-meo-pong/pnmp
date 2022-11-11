import { IsString, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  readonly role: string;

  @IsOptional()
  @IsString()
  readonly createdId: string;

  @IsOptional()
  @IsString()
  readonly updatedId: string;
}
