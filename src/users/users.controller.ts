import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Request } from "express";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

interface JwtUser {
  id: string;
  email: string;
  role: number;
}

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new user account (admin or seller only)" })
  @ApiResponse({
    status: 201,
    description: "User created — returns id, email, role, isActive, createdAt",
  })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Missing or invalid JWT" })
  @ApiResponse({
    status: 403,
    description: "Caller lacks permission for the requested role",
  })
  @ApiResponse({ status: 409, description: "Email already exists" })
  createUser(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.createUser(req.user.id, req.user.role, dto);
  }
}
