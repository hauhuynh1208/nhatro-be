import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../common/enums/user-role.enum";

export class CreateUserDto {
  @ApiProperty({ example: "seller@test.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Test@1234", minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.SELLER,
    description: "2 = seller, 3 = buyer (1 = admin is forbidden)",
  })
  @IsEnum(UserRole)
  role: UserRole;
}
