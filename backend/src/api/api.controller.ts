import { Controller, Get, Param, NotFoundException, Post, Body, UnauthorizedException, Req, InternalServerErrorException, Session } from '@nestjs/common';
import { ProductsService } from 'src/modules/products/products.service';
import { ProductSizesService } from 'src/modules/product_sizes/product_sizes.service';
import { FeedbacksService } from 'src/modules/feedbacks/feedbacks.service';
import { CreateFeedbackDto } from 'src/modules/feedbacks/dto/create-feedback.dto';
import { AuthService } from 'src/modules/users/auth/auth.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import { BcryptHelper } from 'src/utils/bcrypt.helper';

@Controller('api')
export class ApiController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productSizesService: ProductSizesService,
    private readonly feedbacksService: FeedbacksService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  // API lấy tất cả sản phẩm
  @Get('/products')
  async getAllProducts() {
    const products = await this.productsService.getAllProduct();
    const productSizes = await this.productSizesService.getAllProductSize();

    const productsWithSizes = products.map((product) => {
      const sizes = productSizes.filter(
        (size) => size.productId === product.id,
      );
      return {
        ...product,
        product_sizes: sizes,
      };
    });

    return { products: productsWithSizes };
  }

  @Get('/products/:id')
  async getProductById(@Param('id') id: number) {
    const product = await this.productsService.findOne(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Tính toán giá sau khi giảm cho từng kích thước sản phẩm
    const updatedProduct = {
      ...product,
      product_sizes: product.product_sizes?.map((size) => {
        const discount = product.discount || 0;
        const priceProduct = Number(size.price) * (1 - discount / 100);

        return {
          ...size,
          priceProduct: priceProduct.toFixed(2),
        };
      }),
    };

    return { product: updatedProduct };
  }
  @Post('/feedbacks/create')
  async createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    const newFeedback = this.feedbacksService.create(createFeedbackDto);
    return { message: 'Feedback submitted successfully', feedback: newFeedback };
  }

  @Post('/auth/login')
  async login(@Body() loginDto: CreateUserDto, @Req() req: Request) {
    try {
      if (!(req as any).session) {
        throw new InternalServerErrorException('Session chưa được khởi tạo');
      }

      const user = await this.authService.login(loginDto.email, loginDto.password);

      // Chỉ lưu thông tin cần thiết vào session để tránh rủi ro bảo mật
      (req as any).session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        lastName: user.lastName,
        firstName: user.firstName,
        image: user.image,
        phone: user.phone,
        address: user.address,
      };
      console.log((req as any).session.user)

      return { message: 'Đăng nhập thành công', user: (req as any).session.user };
    } catch (error) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
  }

  @Post('/auth/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }


  @Post('/auth/logout')
  async logout(@Req() req: Request) {
    try {
      await this.authService.logout(req);
      return { message: 'Đăng xuất thành công' };
    } catch (error) {
      throw new InternalServerErrorException('Lỗi khi đăng xuất');
    }
  }

  @Get('/me')
  async getProfile(@Req() req: Request) {
    if (!(req as any).session || !(req as any).session.user) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }

    return { user: (req as any).session.user };
  }
  @Get('user')
  async getUser(@Session() session) {
    return { user: session.user || null };
  }

}
