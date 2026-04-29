import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app/app.config';
import databaseConfig from './config/database/database.config';
import { User } from './entities/user.entity';
import { Buyer } from './entities/buyer.entity';
import { Variable } from './entities/variable.entity';
import { Formula } from './entities/formula.entity';
import { UsageRecord } from './entities/usage-record.entity';
import { Submission } from './entities/submission.entity';
import { ReplacementRequest } from './entities/replacement-request.entity';
import { SheetConfig } from './entities/sheet-config.entity';
import { SheetConfigColumn } from './entities/sheet-config-column.entity';
import { Bill } from './entities/bill.entity';
import { BillLineItem } from './entities/bill-line-item.entity';
import { Payment } from './entities/payment.entity';
import { AuditLog } from './entities/audit-log.entity';

const entities = [
  User,
  Buyer,
  Variable,
  Formula,
  UsageRecord,
  Submission,
  ReplacementRequest,
  SheetConfig,
  SheetConfigColumn,
  Bill,
  BillLineItem,
  Payment,
  AuditLog,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        entities,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
