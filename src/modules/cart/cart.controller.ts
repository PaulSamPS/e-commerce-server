import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AddToCartResponse, GetAllResponse } from './types';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { CartModel } from '@/modules/cart/cart.model';
import { Cookies } from '@/decorators/cookies.decorator';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly jwtService: JwtService,
  ) {}
  private async getUserFromToken(accessToken: string) {
    return this.jwtService.decode(accessToken) || null;
  }
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [GetAllResponse] })
  @Get()
  async getCart(@Cookies('auth_access') token: string) {
    const { user } = await this.getUserFromToken(token);

    return this.cartService.getCart(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: AddToCartResponse })
  @Post()
  async addToCart(
    @Body() addToCart: AddToCartDto,
    @Cookies('auth_access') token: string,
  ): Promise<CartModel | { message: string }> {
    const { user } = await this.getUserFromToken(token);

    return this.cartService.add(addToCart, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('increase')
  async increaseCountAndTotalPrice(
    @Body() addToCart: AddToCartDto,
    @Cookies('auth_access') token: string,
  ): Promise<CartModel> {
    const { user } = await this.getUserFromToken(token);

    return this.cartService.increaseCountAndTotalPrice(addToCart, user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('decrease')
  async decreaseCountAndTotalPrice(
    @Body() addToCart: AddToCartDto,
    @Cookies('auth_access') token: string,
  ): Promise<CartModel> {
    const { user } = await this.getUserFromToken(token);

    return this.cartService.decreaseCountAndTotalPrice(addToCart, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  async removeOne(
    @Param('productId') productId: number,
    @Cookies('auth_access') token: string,
  ) {
    const { user } = await this.getUserFromToken(token);

    return this.cartService.remove(productId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async removeAll(@Cookies('auth_access') token: string) {
    const { user } = await this.getUserFromToken(token);

    return this.cartService.removeAll(user.id);
  }
}
