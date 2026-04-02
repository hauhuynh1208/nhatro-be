export enum AuditEventType {
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",
  PASSWORD_RESET_REQUESTED = "password_reset_requested",
  PASSWORD_RESET_COMPLETED = "password_reset_completed",
  TOKEN_REFRESHED = "token_refreshed",
  TOKEN_REVOKED = "token_revoked",
  UNAUTHORIZED_ACCESS = "unauthorized_access",
  FORBIDDEN_ACCESS = "forbidden_access",
  USER_CREATED = "user_created",
}
