import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { SheetColumnType, SystemFieldKey } from '../common/enums';
import { SheetConfig } from './sheet-config.entity';
import { Variable } from './variable.entity';
import { Formula } from './formula.entity';

@Entity('sheet_config_columns')
export class SheetConfigColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sheet_config_id' })
  sheetConfigId: string;

  @Column({ name: 'column_order' })
  columnOrder: number;

  @Column({ type: 'enum', enum: SheetColumnType, name: 'column_type' })
  columnType: SheetColumnType;

  @Column({
    name: 'system_field_key',
    type: 'enum',
    enum: SystemFieldKey,
    nullable: true,
  })
  systemFieldKey: SystemFieldKey | null;

  @Column({ length: 200 })
  label: string;

  @Column({ name: 'variable_id', type: 'uuid', nullable: true })
  variableId: string | null;

  @Column({ name: 'formula_id', type: 'uuid', nullable: true })
  formulaId: string | null;

  @Column({
    name: 'dummy_value',
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
  })
  dummyValue: number;

  @ManyToOne(() => SheetConfig, (sc) => sc.columns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sheet_config_id' })
  sheetConfig: SheetConfig;

  @ManyToOne(() => Variable, { nullable: true })
  @JoinColumn({ name: 'variable_id' })
  variable: Variable | null;

  @ManyToOne(() => Formula, { nullable: true })
  @JoinColumn({ name: 'formula_id' })
  formula: Formula | null;
}
