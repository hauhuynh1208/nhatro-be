import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { AuditLog } from "../entities/audit-log.entity";
import { AuditEventType } from "../common/enums/audit-event-type.enum";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,

    private readonly jwtService: JwtService,
  ) {}

  async login(
    dto: LoginDto,
    meta: { ipAddress?: string; userAgent?: string } = {},
  ): Promise<{
    accessToken: string;
    user: { id: string; email: string; role: string };
  }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    const passwordMatch =
      user && (await bcrypt.compare(dto.password, user.password));

    if (!user || !passwordMatch) {
      await this.auditLogRepository.save(
        this.auditLogRepository.create({
          email: dto.email,
          eventType: AuditEventType.LOGIN_FAILED,
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
          errorMessage: "Invalid credentials",
        }),
      );
      throw new UnauthorizedException("Invalid email or password");
    }

    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        userId: user.id,
        email: user.email,
        eventType: AuditEventType.LOGIN_SUCCESS,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      }),
    );

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
