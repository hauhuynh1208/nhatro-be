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
import { Request } from "express";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

interface JwtUser {
  id: string;
  email: string;
  role: number;
}

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.CREATED)
  createUser(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.createUser(req.user.id, req.user.role, dto);
  }
}
