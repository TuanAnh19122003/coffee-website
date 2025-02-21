import { Injectable, UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../users.service';
import { BcryptHelper } from 'src/utils/bcrypt.helper';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại');

    const isPasswordValid = await BcryptHelper.comparePassword(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Mật khẩu không đúng');

    return user;
  }

  async login(email: string, password: string) {
    return await this.validateUser(email, password);
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password, firstName, lastName } = createUserDto;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    const newUser = await this.usersService.create({
      ...createUserDto,
      roleId: 2,
      image: '/img/default.jpg',
    });

    return { message: 'Đăng ký thành công', user: newUser };
  }

  
  async logout(req: any) {
    if (!req.session) {
      throw new InternalServerErrorException('Session chưa được khởi tạo');
    }
  
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new InternalServerErrorException('Lỗi khi đăng xuất'));
        } else {
          // Xóa cookie liên quan đến session
          req.res.clearCookie('connect.sid');
          resolve({ message: 'Đăng xuất thành công' });
        }
      });
    });
  }
  
}
