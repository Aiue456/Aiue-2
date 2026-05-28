import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GameService } from './game.service';

@Controller('save')
@UseGuards(AuthGuard('jwt'))
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  getSave(@Req() req: any) {
    return this.gameService.getSave(req.user.userId);
  }

  @Post()
  saveProgress(@Req() req: any, @Body() body: any) {
    return this.gameService.saveProgress(req.user.userId, body);
  }
}
