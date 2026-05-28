import { Controller, Get, Param } from '@nestjs/common';
import { LevelsService } from './levels.service';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  findAll() {
    return this.levelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.levelsService.findOne(+id);
  }
}
