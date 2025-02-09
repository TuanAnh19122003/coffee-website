import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private rolesRepository : Repository<Role>
  ) {}

  async findAll() {
    return await this.rolesRepository.find();
  }
  


  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const user = this.rolesRepository.create(createRoleDto);
    return await this.rolesRepository.save(user);
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({where: {id}});
    if(!role){
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: number , updateRoleDto: UpdateRoleDto): Promise<Role | null>{
    const role = await this.findOne(id);
    if(!role){
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    await this.rolesRepository.update(id, updateRoleDto);
    return { ...role, ...updateRoleDto}
  }

  async remove(id: number): Promise<void> {
    await this.rolesRepository.delete(id);
  }
}
