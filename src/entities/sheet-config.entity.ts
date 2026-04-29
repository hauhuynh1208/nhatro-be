import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from './user.entity';
import { SheetConfigColumn } from './sheet-config-column.entity';

@Entity('sheet_configs')
@Index(['sellerId', 'name'], { unique: true })
export class SheetConfig extends BaseEntity {
  @Column({ name: 'seller_id' })
  sellerId: string;

  @Column({ length: 200 })
  name: string;

  @ManyToOne(() => User, (user) => user.sheetConfigs)
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @OneToMany(() => SheetConfigColumn, (col) => col.sheetConfig, {
    cascade: true,
  })
  columns: SheetConfigColumn[];
}
