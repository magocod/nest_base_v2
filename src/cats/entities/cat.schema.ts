import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Owner } from './owner.schema';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;

  @Prop({ required: false, default: false })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: false })
  owner: Owner;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
