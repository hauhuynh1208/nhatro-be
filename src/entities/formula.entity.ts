import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from './user.entity';
import { ExpressionNode } from '../common/types/formula-expression.type';

@Entity('formulas')
@Index(['sellerId', 'name'], { unique: true })
export class Formula extends BaseEntity {
  @Column({ name: 'seller_id' })
  sellerId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'jsonb' })
  expression: ExpressionNode;

  @ManyToOne(() => User, (user) => user.formulas)
  @JoinColumn({ name: 'seller_id' })
  seller: User;
}
