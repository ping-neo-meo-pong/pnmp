import { IsBoolean } from 'class-validator';

export class SuccessOrFailDto {
  @IsBoolean()
  readonly success: boolean;
}
