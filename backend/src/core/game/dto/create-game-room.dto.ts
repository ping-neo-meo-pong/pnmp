import { IsString, IsOptional } from "class-validator";
import { User } from "src/core/user/user.entity";

export class CreateGameRoomDto {
    @IsOptional()
    @IsString()
    leftUserId: User;

    @IsString()
    readonly rightUserId: User;
}