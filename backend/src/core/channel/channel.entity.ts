import { Column, Entity } from 'typeorm';
import { Base } from '../Base.entity';

@Entity()
export class Channel extends Base {
  @Column({
    type: 'varchar',
    length: 50,
    comment: '채널 이름',
  })
  channelName: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '채널 설명',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '채널 비밀번호',
    nullable: true,
  })
  password: string;

  @Column({
    comment: '공개 비공개 설정 여부',
  })
  isPublic: boolean;

  @Column({
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  deletedAt: Date;
}
