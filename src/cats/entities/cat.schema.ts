import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  breed: string;

  @Prop({ required: false, default: false })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: false })
  owner?: mongoose.Types.ObjectId;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
