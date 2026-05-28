import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { GameModule } from './game/game.module'
import { SocialModule } from './social/social.module'
import { LevelsModule } from './levels/levels.module'

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/campus-maze'),
    AuthModule,
    UsersModule,
    GameModule,
    SocialModule,
    LevelsModule,
  ],
})
export class AppModule {}
