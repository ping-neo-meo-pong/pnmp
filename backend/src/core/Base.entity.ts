import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '생성일',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '수정일',
  })
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  createdId: string;

  @Column({
    nullable: true,
  })
  updatedId: string;
}
