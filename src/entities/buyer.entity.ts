import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { SoftDeletableEntity } from '../common/entities/base.entity';
import { User } from './user.entity';
import { Formula } from './formula.entity';
import { Submission } from './submission.entity';
import { ReplacementRequest } from './replacement-request.entity';
import { Bill } from './bill.entity';

@Entity('buyers')
@Index(['username'], { unique: true })
@Index(['sellerId', 'fullName'], { unique: true })
export class Buyer extends SoftDeletableEntity {
  @Column({ name: 'seller_id' })
  sellerId: string;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'full_name', length: 200 })
  fullName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'people_count' })
  peopleCount: number;

  @Column({ name: 'room_price', type: 'decimal', precision: 15, scale: 2 })
  roomPrice: number;

  @Column({ name: 'formula_id', type: 'uuid', nullable: true })
  formulaId: string | null;

  @ManyToOne(() => User, (user) => user.buyers)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @ManyToOne(() => Formula, { nullable: true })
  @JoinColumn({ name: 'formula_id' })
  formula: Formula | null;

  @OneToMany(() => Submission, (submission) => submission.buyer)
  submissions: Submission[];

  @OneToMany(() => ReplacementRequest, (rr) => rr.buyer)
  replacementRequests: ReplacementRequest[];

  @OneToMany(() => Bill, (bill) => bill.buyer)
  bills: Bill[];
}
