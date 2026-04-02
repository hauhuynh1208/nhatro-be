import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { AuditLog } from "../entities/audit-log.entity";
import { UserRole } from "../common/enums/user-role.enum";
import { AuditEventType } from "../common/enums/audit-event-type.enum";
import { CreateUserDto } from "./dto/create-user.dto";

const ALLOWED_ROLES: Record<number, UserRole[]> = {
  [UserRole.ADMIN]: [UserRole.SELLER, UserRole.BUYER],
  [UserRole.SELLER]: [UserRole.BUYER],
  [UserRole.BUYER]: [],
};

export interface CreatedUserPayload {
  id: string;
  email: string;
  role: number;
  isActive: boolean;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async createUser(
    callerId: string,
    callerRole: number,
    dto: CreateUserDto,
  ): Promise<CreatedUserPayload> {
    if (dto.role === UserRole.ADMIN) {
      throw new ForbiddenException("Cannot create an admin account via API");
    }

    const allowed = ALLOWED_ROLES[callerRole] ?? [];
    if (!allowed.includes(dto.role)) {
      throw new ForbiddenException(
        "You do not have permission to create a user with this role",
      );
    }

    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.save(
      this.userRepository.create({
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        isActive: true,
      }),
    );

    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        userId: callerId,
        email: dto.email,
        eventType: AuditEventType.USER_CREATED,
        metadata: { targetEmail: dto.email, targetRole: dto.role },
      }),
    );

    return {
      id: user.id,
      email: user.email,
      role: user.role as number,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
