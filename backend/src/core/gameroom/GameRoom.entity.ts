import { Column, Entity } from 'typeorm';
import { Base } from '../Base.entity';

@Entity('GameRoom')
export class GameRoom extends Base {
  @Column({
    type: 'varchar',
    length: 50,
    comment: '게임 모드',
  })
  gameMode: string;
}
