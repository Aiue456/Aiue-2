import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ collection: 'gameProgress' })
export class GameProgress extends Document {
  @Prop({ required: true, unique: true }) userId: string
  @Prop({ type: [String], default: [] }) completedLevels: string[]
  @Prop({ type: Object, default: {} }) levelStars: Record<string, number>
  @Prop({ type: [Object], default: [] }) notesCollection: any[]
  @Prop({ type: [String], default: [] }) unlockedChapters: string[]
  @Prop({ default: 0 }) totalPlayTime: number
  @Prop({ type: [Object], default: [] }) achievements: any[]
  @Prop({ default: Date.now }) updatedAt: number
}

export const GameProgressSchema = SchemaFactory.createForClass(GameProgress)
