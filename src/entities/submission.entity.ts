import { Entity, Column, Index, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { SubmissionStatus } from '../common/enums';
import { UsageRecord } from './usage-record.entity';
import { Buyer } from './buyer.entity';

@Entity('submissions')
@Index(['usageRecordId', 'buyerId'], { unique: true })
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'usage_record_id' })
  usageRecordId: string;

  @Column({ name: 'buyer_id' })
  buyerId: string;

  @Column({
    name: 'electricity_current',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  electricityCurrent: number | null;

  @Column({
    name: 'water_current',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  waterCurrent: number | null;

  @Column({ name: 'photo_urls', type: 'jsonb', nullable: true })
  photoUrls: string[] | null;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @CreateDateColumn({ name: 'submitted_at' })
  submittedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UsageRecord, (usageRecord) => usageRecord.submissions)
  @JoinColumn({ name: 'usage_record_id' })
  usageRecord: UsageRecord;

  @ManyToOne(() => Buyer, (buyer) => buyer.submissions)
  @JoinColumn({ name: 'buyer_id' })
  buyer: Buyer;
}
