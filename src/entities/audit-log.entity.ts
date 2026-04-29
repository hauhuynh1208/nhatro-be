import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ActorType, AuditAction } from '../common/enums';

/**
 * Append-only activity log. Uses auto-increment PK (not UUID) for
 * high-write insert performance.
 */
@Entity('audit_logs')
@Index(['actorId', 'createdAt'])
@Index(['targetType', 'targetId'])
export class AuditLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'actor_type', type: 'enum', enum: ActorType })
  actorType: ActorType;

  @Column({ name: 'actor_id', type: 'uuid' })
  actorId: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ name: 'target_type', length: 100 })
  targetType: string;

  @Column({ name: 'target_id', type: 'uuid' })
  targetId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
