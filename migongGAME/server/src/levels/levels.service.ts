import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Level } from '../schemas'
import { levelSeeds } from './seed'

@Injectable()
export class LevelsService implements OnModuleInit {
  constructor(@InjectModel(Level.name) private levelModel: Model<Level>) {}

  async onModuleInit() {
    for (const seed of levelSeeds) {
      const exists = await this.levelModel.findOne({ id: seed.id }).exec()
      if (!exists) {
        await this.levelModel.create(seed)
      }
    }
    console.log(`${levelSeeds.length} levels seeded.`)
  }

  async findAll() {
    const levels = await this.levelModel.find().exec()
    return {
      success: true,
      data: levels
        .map((l) => ({ id: l.id, title: l.title, difficulty: l.difficulty, storyIntro: l.storyIntro, stars: l.stars }))
        .sort((a, b) => a.id - b.id),
    }
  }

  async findOne(id: number) {
    const level = await this.levelModel.findOne({ id }).exec()
    if (!level) throw new NotFoundException('关卡不存在')
    return { success: true, data: level }
  }
}
