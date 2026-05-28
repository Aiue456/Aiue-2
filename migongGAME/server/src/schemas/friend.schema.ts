import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ collection: 'friends' })
export class Friend extends Document {
  @Prop({ required: true }) userId: string
  @Prop({ required: true }) friendId: string
  @Prop({ default: 'pending' }) status: 'pending' | 'accepted'
  @Prop({ default: Date.now }) createdAt: number
}

export const FriendSchema = SchemaFactory.createForClass(Friend)
