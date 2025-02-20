import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Cat } from './cat.schema';
// import { Cat } from './cat.schema';

export type OwnerDocument = HydratedDocument<Owner>;

@Schema()
export class Owner {
  @Prop({ required: true })
  email: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cat' }] })
  cats: Cat[];
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);
