export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
}

export enum ActorType {
  ADMIN = 'admin',
  SELLER = 'seller',
  BUYER = 'buyer',
}

export enum UsageRecordStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DISCARDED = 'discarded',
  MANUAL = 'manual',
}

export enum ReplacementType {
  ELECTRICITY = 'electricity',
  WATER = 'water',
}

export enum SheetColumnType {
  SYSTEM_FIELD = 'system_field',
  CUSTOM = 'custom',
}

export enum SystemFieldKey {
  PEOPLE_COUNT = 'people_count',
  ROOM_PRICE = 'room_price',
  ELECTRICITY_OLD = 'electricity_old',
  ELECTRICITY_NEW = 'electricity_new',
  ELECTRICITY_USED = 'electricity_used',
  WATER_OLD = 'water_old',
  WATER_NEW = 'water_new',
  WATER_USED = 'water_used',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  DISCARD = 'discard',
  CLOSE = 'close',
  EXPORT = 'export',
}
