import { Column, Entity } from 'typeorm';
import { Base } from '../Base.entity';

@Entity('DmRoom')
export class DmRoom extends Base {
  @Column({
    type: 'timestamp',
  })
  user1LeftTime: Date;

  @Column({
    type: 'timestamp',
  })
  user2LeftTime: Date;
}
