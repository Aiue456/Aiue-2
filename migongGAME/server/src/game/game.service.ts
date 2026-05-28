import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { GameProgress } from '../schemas'

@Injectable()
export class GameService {
  constructor(@InjectModel(GameProgress.name) private gameProgressModel: Model<GameProgress>) {}

  async getSave(userId: string) {
    let progress = await this.gameProgressModel.findOne({ userId }).exec()
    if (!progress) {
      progress = await this.gameProgressModel.create({
        userId,
        completedLevels: [],
        levelStars: {},
        notesCollection: [],
        unlockedChapters: [],
        totalPlayTime: 0,
        achievements: [],
        updatedAt: Date.now(),
      })
    }
    return { success: true, data: progress }
  }

  async saveProgress(userId: string, data: any) {
    const r = await this.gameProgressModel.findOneAndUpdate(
      { userId },
      { ...data, updatedAt: Date.now() },
      { upsert: true, new: true },
    ).exec()
    return { success: true, message: '存档保存成功', updatedAt: r.updatedAt }
  }
}
