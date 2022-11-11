import { Entity, Column } from 'typeorm';
import { Base } from '../Base.entity';

@Entity('Role')
export class Role extends Base {
  @Column({
    type: 'varchar',
    length: 50,
    comment: '역할',
  })
  role: string;
}
