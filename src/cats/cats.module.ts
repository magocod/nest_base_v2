import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema, Owner, OwnerSchema } from './entities';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatSchema },
      { name: Owner.name, schema: OwnerSchema },
    ]),
  ],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
