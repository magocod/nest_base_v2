import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateAudioDto {
  @ApiProperty()
  @IsString()
  file: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  log: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  error: boolean;
}
