import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GameService } from './game.service'
import { GameController } from './game.controller'
import { GameProgress, GameProgressSchema } from '../schemas'

@Module({
  imports: [MongooseModule.forFeature([{ name: GameProgress.name, schema: GameProgressSchema }])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
