import { Injectable,Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../database/entities/user.entity';
import { RolesService } from '../roles/roles.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<User>, 
    private readonly rolesService: RolesService,
  ){}

  async findAll(page: number, limit: number): Promise<any> {
    const [users, totalItems] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,  
      take: limit,
      relations: ['role'] 
    });
    return {
      users,
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
    }
  }
  async getAllRoles() {
    return await this.rolesService.getAll();
  }
  async create(createUserDto: CreateUserDto, file?: Express.Multer.File): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại. Vui lòng sử dụng email khác.');
    }
    const user = this.usersRepository.create(createUserDto);
    if (file) {
      user.image = `/uploads/${file.filename}`; 
    }
    if (createUserDto.roleId) {
      user.role = await this.rolesService.findOne(createUserDto.roleId);
    }
    return await this.usersRepository.save(user);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }


  async getAll() {
    return await this.usersRepository.find();
  }
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {id},
      relations:['role']
    });
    if(!user){
      throw new NotFoundException(`user with ID ${id} not found`);
    }
    return user;
  }


  async update(id: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<User> {
    const user = await this.findOne(id);
    if (file) {
      if(user.image){
        const oldImagePath = path.join(__dirname, '..', '..', '..', 'public', 'uploads', path.basename(user.image));
        //console.log("ĐƯờng dẫn ảnh cũ: "+ oldImagePath)    
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("ảnh cũ đã được xóa")
        }
      }
      user.image = `/uploads/${file.filename}`;
    }
    if (updateUserDto.roleId) {
      user.role = await this.rolesService.findOne(updateUserDto.roleId);
    }
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }


  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if(user.image){
      const oldImagePath = path.join(__dirname, '..', '..', '..', 'public', 'uploads', path.basename(user.image));
      //console.log("ĐƯờng dẫn ảnh cũ: "+ oldImagePath)    
      if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("ảnh và thông tin của người dùng đã được xóa")
      }
    }
    await this.usersRepository.delete({id});
  }
}
