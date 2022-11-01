import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Base } from './Base.entity';

@Entity('role')
export class Role extends Base {

	@Column({ type: 'varchar', length: 50, comment: '역할' })
	role : string;

}
