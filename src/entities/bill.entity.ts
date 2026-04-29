import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Buyer } from './buyer.entity';
import { SheetConfig } from './sheet-config.entity';
import { UsageRecord } from './usage-record.entity';
import { ReplacementRequest } from './replacement-request.entity';
import { BillLineItem } from './bill-line-item.entity';
import { Payment } from './payment.entity';

@Entity('bills')
@Index(['buyerId', 'billingCycle'], { unique: true })
@Index(['sellerId', 'createdAt'])
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'seller_id' })
  sellerId: string;

  @Column({ name: 'buyer_id' })
  buyerId: string;

  @Column({ length: 200 })
  name: string;

  /** Format: YYYY-MM, e.g. '2025-04' */
  @Column({ name: 'billing_cycle', length: 7 })
  billingCycle: string;

  @Column({ name: 'sheet_config_id', type: 'uuid', nullable: true })
  sheetConfigId: string | null;

  @Column({ name: 'usage_record_id', type: 'uuid', nullable: true })
  usageRecordId: string | null;

  @Column({ name: 'reference_record_id', type: 'uuid', nullable: true })
  referenceRecordId: string | null;

  @Column({ name: 'electricity_replacement_id', type: 'uuid', nullable: true })
  electricityReplacementId: string | null;

  @Column({ name: 'water_replacement_id', type: 'uuid', nullable: true })
  waterReplacementId: string | null;

  /** Snapshot of buyer's people_count at bill creation time (immutable) */
  @Column({ name: 'snapshot_people_count' })
  snapshotPeopleCount: number;

  /** Snapshot of buyer's room_price at bill creation time (immutable) */
  @Column({
    name: 'snapshot_room_price',
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  snapshotRoomPrice: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  totalAmount: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.bills)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @ManyToOne(() => Buyer, (buyer) => buyer.bills)
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;

  @ManyToOne(() => SheetConfig, { nullable: true })
  @JoinColumn({ name: 'sheet_config_id' })
  sheetConfig: SheetConfig | null;

  @ManyToOne(() => UsageRecord, { nullable: true })
  @JoinColumn({ name: 'usage_record_id' })
  usageRecord: UsageRecord | null;

  @ManyToOne(() => UsageRecord, { nullable: true })
  @JoinColumn({ name: 'reference_record_id' })
  referenceRecord: UsageRecord | null;

  @ManyToOne(() => ReplacementRequest, { nullable: true })
  @JoinColumn({ name: 'electricity_replacement_id' })
  electricityReplacement: ReplacementRequest | null;

  @ManyToOne(() => ReplacementRequest, { nullable: true })
  @JoinColumn({ name: 'water_replacement_id' })
  waterReplacement: ReplacementRequest | null;

  @OneToMany(() => BillLineItem, (item) => item.bill, { cascade: true })
  lineItems: BillLineItem[];

  @OneToMany(() => Payment, (payment) => payment.bill)
  payments: Payment[];
}
