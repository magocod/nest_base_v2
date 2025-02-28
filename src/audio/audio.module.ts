import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { BullModule } from '@nestjs/bullmq';
import { AudioQueueNames } from './audio.constants';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AudioConsumer } from './audio.consumer';

export const audioQueueConfig = [
  BullModule.registerQueue({
    name: AudioQueueNames.example,
  }),
];

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    ...audioQueueConfig
  ],
  controllers: [AudioController],
  providers: [AudioService, AudioConsumer],
  exports: [BullModule, AudioService, AudioConsumer],
})
export class AudioModule {}
