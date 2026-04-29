import { Entity, Column, Index, OneToMany } from 'typeorm';
import { SoftDeletableEntity } from '../common/entities/base.entity';
import { UserRole } from '../common/enums';
import { Buyer } from './buyer.entity';
import { Variable } from './variable.entity';
import { Formula } from './formula.entity';
import { UsageRecord } from './usage-record.entity';
import { ReplacementRequest } from './replacement-request.entity';
import { SheetConfig } from './sheet-config.entity';
import { Bill } from './bill.entity';

@Entity('users')
@Index(['username'], { unique: true })
export class User extends SoftDeletableEntity {
  @Column({ length: 100, unique: true })
  username: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'full_name', type: 'varchar', length: 200, nullable: true })
  fullName: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Buyer, (buyer) => buyer.seller)
  buyers: Buyer[];

  @OneToMany(() => Variable, (variable) => variable.seller)
  variables: Variable[];

  @OneToMany(() => Formula, (formula) => formula.seller)
  formulas: Formula[];

  @OneToMany(() => UsageRecord, (usageRecord) => usageRecord.seller)
  usageRecords: UsageRecord[];

  @OneToMany(() => ReplacementRequest, (rr) => rr.seller)
  replacementRequests: ReplacementRequest[];

  @OneToMany(() => SheetConfig, (sc) => sc.seller)
  sheetConfigs: SheetConfig[];

  @OneToMany(() => Bill, (bill) => bill.seller)
  bills: Bill[];
}
