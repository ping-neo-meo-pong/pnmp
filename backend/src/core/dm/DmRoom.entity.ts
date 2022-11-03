import { Column, Entity } from 'typeorm';
import { Base } from '../Base.entity';

@Entity('DmRoom')
export class DmRoom extends Base {
  @Column({
    type: 'datetime',
  })
  user1LeftTime: Date;

  @Column({
    type: 'datetime',
  })
  user2LeftTime: Date;
}
