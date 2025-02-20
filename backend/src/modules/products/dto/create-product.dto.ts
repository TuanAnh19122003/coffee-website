export class CreateProductDto {
  name: string;
  discount: number;
  image: string;
  description?: string;
  categoryId: number;
}
