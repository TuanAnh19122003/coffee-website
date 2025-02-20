export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  image: string;
  password: string;
  roleId: number;
}
