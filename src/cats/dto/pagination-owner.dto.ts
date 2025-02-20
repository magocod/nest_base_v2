import { PaginationMongoDto } from '../../common/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { queryStringBoolean } from '../../common/common.constants';

export class PaginationOwnerDto extends PaginationMongoDto {
  @ApiProperty({
    default: false,
    description: 'load cats',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    return queryStringBoolean.indexOf(value) > -1;
  })
  withCats?: boolean;
}
