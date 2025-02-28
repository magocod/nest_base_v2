import { PartialType } from '@nestjs/swagger';
import { CreateAudioDto } from './create-audio.dto';

export class UpdateAudioDto extends PartialType(CreateAudioDto) {}
