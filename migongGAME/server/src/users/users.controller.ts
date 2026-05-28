import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Req() req: any, @Body() body: { username?: string; avatar?: string }) {
    return this.usersService.updateProfile(req.user.userId, body);
  }
}
