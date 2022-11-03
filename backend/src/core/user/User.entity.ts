import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
  OneToOne,
} from 'typeorm';
import { Base } from '../Base.entity';
import { Role } from '../role/Role.entity';
import { Score } from '../score/Score.entity';

@Entity('user')
@Unique(['apiId'])
export class User extends Base {
  @Column({
    type: 'varchar',
    length: 50,
    comment: '유저 닉네임',
  })
  nickName: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '유저 이름',
  })
  userName: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'api Id',
  })
  apiId: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '프로필 사진',
  })
  profileImage: string;

  @Column({
    type: 'boolean',
    comment: '참가 여부',
  })
  participate: boolean;

  @Column({
    type: 'varchar',
    length: 50,
  })
  eMail: string;

  @OneToOne((type) => Role, (role) => role.id)
  @JoinColumn({ name: 'role_id' })
  roleId: Role;

  // @OneToMany(() => Score, (score) => score.id)
  // userId: Score[];
}
