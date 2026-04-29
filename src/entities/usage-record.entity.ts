import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { UsageRecordStatus } from '../common/enums';
import { User } from './user.entity';
import { Submission } from './submission.entity';

@Entity('usage_records')
@Index(['sellerId', 'name'], { unique: true })
@Index(['linkToken'], { unique: true })
export class UsageRecord extends BaseEntity {
  @Column({ name: 'seller_id' })
  sellerId: string;

  @Column({ length: 200 })
  name: string;

  @Column({ name: 'link_token', unique: true })
  linkToken: string;

  @Column({
    type: 'enum',
    enum: UsageRecordStatus,
    default: UsageRecordStatus.OPEN,
  })
  status: UsageRecordStatus;

  @ManyToOne(() => User, (user) => user.usageRecords)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @OneToMany(() => Submission, (submission) => submission.usageRecord)
  submissions: Submission[];
}
