import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminCreateUserDto, AdminUpdateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';
import { Role } from '../roles/entities';
import { In, Repository } from 'typeorm';
import { SimplePaginationDto } from '../../common/dtos';
import { generatePagination } from '../../common/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  getRepository(): Repository<User> {
    return this.userRepository;
  }

  async create(createUserDto: AdminCreateUserDto) {
    let roles: Role[] = [];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (createUserDto.roles?.length > 0) {
      roles = await this.roleRepository.find({
        where: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          id: In(createUserDto.roles),
        },
      });
    }

    const user = this.userRepository.create({
      ...createUserDto,
      roles,
    });

    await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete user.password;

    return user;
  }

  async findAll(paginationDto: SimplePaginationDto) {
    // const { limit = 10, offset = 0 } = paginationDto;
    const { page = 10, perPage = 0 } = paginationDto;
    const { pagination, offset } = generatePagination<User>(page, perPage);

    const [users, total] = await this.userRepository.findAndCount({
      take: pagination.perPage,
      skip: offset,
      relations: {
        roles: {
          permissions: true,
        },
      },
    });

    pagination.data = users;
    pagination.total = total;

    return pagination;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });

    if (!user) throw new NotFoundException(`Role with ${id} not found`);

    return user;
  }

  async update(id: number, updateUserDto: AdminUpdateUserDto) {
    // eslint-disable-next-line prefer-const
    let { roles, ...toUpdate } = updateUserDto;
    let rolesInstances: Role[] = [];

    const user = await this.userRepository.preload({ id, ...toUpdate });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (roles?.length > 0) {
      rolesInstances = await this.roleRepository.find({
        where: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          id: In(roles),
        },
      });

      if (rolesInstances.length > 0) {
        user.roles = rolesInstances;
      }
    }

    await this.userRepository.save(user);

    return this.findOne(user.id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
