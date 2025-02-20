import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from 'src/database/entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private rolesRepository: Repository<Role>,
  ) {}

  async findAll(page: number, limit: number) {
    const [roles, totalItems] = await this.rolesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      roles,
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
    };
  }
  async getAll() {
    return await this.rolesRepository.find();
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.rolesRepository.create(createRoleDto);
    return await this.rolesRepository.save(role);
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    await this.rolesRepository.update(id, updateRoleDto);
    return { ...role, ...updateRoleDto };
  }

  async remove(id: number): Promise<void> {
    await this.rolesRepository.delete(id);
  }
}
