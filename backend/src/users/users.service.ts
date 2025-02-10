import { Injectable,Inject, NotFoundException, ConsoleLogger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RolesService } from 'src/roles/roles.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<User>, 
    private readonly rolesService: RolesService,
  ){}
  async getAllRoles() {
    return await this.rolesService.findAll();
  }
  async create(createUserDto: CreateUserDto, file?: Express.Multer.File): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    if (file) {
      user.image = `/uploads/${file.filename}`; 
    }
    if (createUserDto.roleId) {
      user.role = await this.rolesService.findOne(createUserDto.roleId);
    }
    return await this.usersRepository.save(user);
  }


  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: ['role']
    });
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
        const oldImagePath = path.join(__dirname, '..', '..', 'public', 'uploads', path.basename(user.image));
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
      const oldImagePath = path.join(__dirname, '..', '..', 'public', 'uploads', path.basename(user.image));
      //console.log("ĐƯờng dẫn ảnh cũ: "+ oldImagePath)    
      if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("ảnh và thông tin của người dùng đã được xóa")
      }
    }
    await this.usersRepository.delete(user);
  }
}
