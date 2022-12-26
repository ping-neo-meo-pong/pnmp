import { IsString } from 'class-validator';

export class DirectMessageDto {
  @IsString()
  readonly roomId: string;

  @IsString()
  readonly userId: string;

  @IsString()
  readonly username: string;

  @IsString()
  readonly msg: string;
}
