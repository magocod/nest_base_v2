import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from './entities';
import { Model } from 'mongoose';
import { PaginationMongoDto } from '../common/dtos';
import { DEFAULT_LIMIT_PAGINATION, PaginationMongo } from '../common/utils';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  async create(createCatDto: CreateCatDto)  {
    const createdCat = await this.catModel.create(createCatDto);
    return createdCat;
  }

  async findAll(paginationDto: PaginationMongoDto) {
    const { limit = DEFAULT_LIMIT_PAGINATION, skip = 0 } = paginationDto;
    const query = this.catModel.find();

    const total = await query.clone().countDocuments().exec();

    query.limit(limit).skip(skip);

    // if (paginationDto.limit !== undefined) {
    //   query.limit(paginationDto.limit);
    // }
    //
    // if (paginationDto.skip !== undefined) {
    //   query.skip(paginationDto.skip);
    // }

    query.populate('owner');

    const pagination: PaginationMongo<CatDocument> = {
      data: await query.exec(),
      limit,
      skip,
      total,
    };

    return pagination;
  }

  async findOne(id: string) {
    const cat = await this.catModel.findOne({
      _id: id ,
    }).exec();

    if (!cat)
      throw new NotFoundException(`Cat with id: ${id} not found`);

    return cat;
  }

  async update(id: string, updateCatDto: UpdateCatDto) {
    await this.findOne(id);

    return this.catModel
      .findByIdAndUpdate({ _id: id }, updateCatDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedCat = await this.catModel
      .findByIdAndDelete({ _id: id })
      .exec();
    return deletedCat;
  }
}
