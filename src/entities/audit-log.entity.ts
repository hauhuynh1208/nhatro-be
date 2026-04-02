import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";
import { AuditEventType } from "../common/enums/audit-event-type.enum";

@Entity("audit_logs")
@Index(["userId", "createdAt"])
@Index(["eventType", "createdAt"])
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  email: string;

  @Column({
    type: "enum",
    enum: AuditEventType,
    enumName: "audit_event_type_enum",
  })
  eventType: AuditEventType;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
