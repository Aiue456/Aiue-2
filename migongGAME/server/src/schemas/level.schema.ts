import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ collection: 'levels' })
export class Level extends Document {
  @Prop({ required: true, unique: true }) id: number
  @Prop({ required: true }) title: string
  @Prop({ default: 'easy' }) difficulty: string
  @Prop({ default: '' }) storyIntro: string
  @Prop({ default: '' }) mission: string
  @Prop({ default: '' }) npcNeeds: string
  @Prop({ default: '' }) postNote: string
  @Prop({ default: '' }) noteDate: string
  @Prop({ default: '' }) values: string
  @Prop({ default: '' }) helpedPerson: string
  @Prop({ default: '' }) action: string
  @Prop({ default: '' }) location: string
  @Prop({ default: 1 }) stars: number
  @Prop({ type: Object, default: {} }) mapData: Record<string, any>
}

export const LevelSchema = SchemaFactory.createForClass(Level)
