import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities';
import { Permission } from '../permissions/entities';
import { In, Repository } from 'typeorm';
import { SimplePaginationDto } from '../../common/dtos';
import { generatePagination } from '../../common/utils';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  getRepository(): Repository<Role> {
    return this.roleRepository;
  }

  async create(createRoleDto: CreateRoleDto) {
    let permissions: Permission[] = [];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (createRoleDto.permissions?.length > 0) {
      permissions = await this.permissionRepository.find({
        where: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          id: In(createRoleDto.permissions),
        },
      });
    }

    const role = this.roleRepository.create({
      ...createRoleDto,
      permissions,
    });

    await this.roleRepository.save(role);

    return role;
  }

  async findAll(paginationDto: SimplePaginationDto) {
    // const { limit = 10, offset = 0 } = paginationDto;
    const { page = 10, perPage = 0 } = paginationDto;
    const { pagination, offset } = generatePagination<Role>(page, perPage);

    const [roles, total] = await this.roleRepository.findAndCount({
      take: pagination.perPage,
      skip: offset,
      relations: {
        permissions: true,
      },
    });

    pagination.data = roles;
    pagination.total = total;

    return pagination;
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: {
        permissions: true,
      },
    });

    if (!role) throw new NotFoundException(`Role with ${id} not found`);

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // eslint-disable-next-line prefer-const
    let { permissions, ...toUpdate } = updateRoleDto;
    let permissionsInstances: Permission[] = [];

    const role = await this.roleRepository.preload({ id, ...toUpdate });
    if (!role) throw new NotFoundException(`Role with id: ${id} not found`);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (permissions?.length > 0) {
      permissionsInstances = await this.permissionRepository.find({
        where: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          id: In(permissions),
        },
      });

      if (permissionsInstances.length > 0) {
        role.permissions = permissionsInstances;
      }
    }

    await this.roleRepository.save(role);

    return this.findOne(role.id);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }
}
