import { Injectable } from '@nestjs/common';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { AudioExampleQueue, AudioQueueNames } from './audio.constants';

@Injectable()
export class AudioService {
  constructor(@InjectQueue(AudioQueueNames.example) private audioQueue: AudioExampleQueue) {}

  async create(createAudioDto: CreateAudioDto) {
    return await this.audioQueue.add('transcode', createAudioDto);
  }

  findAll() {
    return `This action returns all audio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} audio`;
  }

  update(id: number, updateAudioDto: UpdateAudioDto) {
    return `This action updates a #${id} audio`;
  }

  remove(id: number) {
    return `This action removes a #${id} audio`;
  }
}
