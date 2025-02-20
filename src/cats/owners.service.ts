import { Injectable } from '@nestjs/common';
import { CreateOwnerDto } from './entities/create-owner.dto';
import { UpdateOwnerDto } from './entities/update-owner.dto';

@Injectable()
export class OwnersService {
  create(createOwnerDto: CreateOwnerDto) {
    return 'This action adds a new owner';
  }

  findAll() {
    return `This action returns all owners`;
  }

  findOne(id: number) {
    return `This action returns a #${id} owner`;
  }

  update(id: number, updateOwnerDto: UpdateOwnerDto) {
    return `This action updates a #${id} owner`;
  }

  remove(id: number) {
    return `This action removes a #${id} owner`;
  }
}
