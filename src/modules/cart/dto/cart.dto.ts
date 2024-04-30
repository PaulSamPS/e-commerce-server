import { ProductCartDto } from '@/modules/cart/dto/productCart.dto';

export class CartDto {
  user: number;
  products: ProductCartDto[];
  total_price: number;
}
