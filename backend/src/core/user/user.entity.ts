import { Entity, Column, Unique } from 'typeorm';
import { Base } from '../Base.entity';
import { UserRole } from '../../enum/user-role.enum';
import { UserStatus } from '../../enum/user-status';

@Entity()
@Unique(['username', 'email'])
export class User extends Base {
  @Column({
    type: 'varchar',
    length: 50,
    comment: '유저 역할',
    default: UserRole.NORMAL,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '유저 이름',
  })
  username: string;

  @Column({
    comment: '2단계 인증 여부',
    default: false,
  })
  twoFactorAuth: boolean;

  @Column({
    comment: '2fa 에 사용될 비밀키',
  })
  twoFactorAuthSecret: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'text',
    comment: '프로필 사진',
    nullable: true,
  })
  profileImage: string;

  @Column({
    comment: '유저 상태',
    default: UserStatus.OFFLINE,
  })
  status: UserStatus;

  @Column({
    type: 'smallint',
    comment: '래더 등급',
    default: 1,
  })
  ladder: number;
}
