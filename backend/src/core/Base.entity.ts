import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Base {
	@PrimaryGeneratedColumn('uuid')
	id: number;

	@CreateDateColumn({ name: 'create_at', comment: '생성일' })
	createdAt: Date;
	
	@UpdateDateColumn({ name: 'update_at', comment: '수정일' })
	updatedAt: Date;

	@Column({
		nullable: true
	})
	createdId: string;

	@Column({
		nullable: true
	})
	updatedId: string;
}
