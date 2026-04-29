import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Bill } from './bill.entity';

/**
 * Immutable snapshot of a computed column value for a bill.
 * Intentionally has no FK back to sheet_config_columns — bills must not change
 * when a sheet config is later modified.
 */
@Entity('bill_line_items')
export class BillLineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bill_id' })
  billId: string;

  @Column({ name: 'column_order' })
  columnOrder: number;

  @Column({ length: 200 })
  label: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  value: number;

  @ManyToOne(() => Bill, (bill) => bill.lineItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bill_id' })
  bill: Bill;
}
