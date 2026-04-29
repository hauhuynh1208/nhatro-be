import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ReplacementType } from '../common/enums';
import { User } from './user.entity';
import { Buyer } from './buyer.entity';

@Entity('replacement_requests')
export class ReplacementRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'seller_id' })
  sellerId: string;

  @Column({ name: 'buyer_id' })
  buyerId: string;

  @Column({ type: 'enum', enum: ReplacementType })
  type: ReplacementType;

  /**
   * x — the old physical meter reading at the time of swap.
   * Consumption formula: (b − a) + (x − y)
   *   b = buyer's current submission reading
   *   a = new_reading (new meter initial reading)
   *   x = old_reading (old meter reading at swap time)
   *   y = buyer's reference submission reading (derived at query time)
   */
  @Column({ name: 'old_reading', type: 'decimal', precision: 10, scale: 2 })
  oldReading: number;

  /** a — the new meter's initial reading after swap. */
  @Column({ name: 'new_reading', type: 'decimal', precision: 10, scale: 2 })
  newReading: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.replacementRequests)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @ManyToOne(() => Buyer, (buyer) => buyer.replacementRequests)
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;
}
