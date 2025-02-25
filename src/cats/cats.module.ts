import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Cat,
  CatSchema,
  Owner,
  OwnerSchema,
  Story,
  StorySchema,
} from './entities';
import { OwnersController } from './owners.controller';
import { OwnersService } from './owners.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatSchema },
      { name: Owner.name, schema: OwnerSchema },
      { name: Story.name, schema: StorySchema },
    ]),
  ],
  controllers: [CatsController, OwnersController],
  providers: [CatsService, OwnersService],
  exports: [CatsService, OwnersService],
})
export class CatsModule {}
