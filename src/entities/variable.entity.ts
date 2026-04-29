import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from './user.entity';

@Entity('variables')
@Index(['sellerId', 'name'], { unique: true })
export class Variable extends BaseEntity {
  @Column({ name: 'seller_id' })
  sellerId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => User, (user) => user.variables)
  @JoinColumn({ name: 'seller_id' })
  seller: User;
}
