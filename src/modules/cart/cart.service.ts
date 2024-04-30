import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CartModel } from './cart.model';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductCartDto } from '@/modules/cart/dto/productCart.dto';
import { ProductsService } from '@/modules/product';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartModel)
    private cartModel: typeof CartModel,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(userId: number): Promise<CartModel[]> {
    return this.cartModel.findAll({ where: { userId } });
  }

  async getCart(userId: number) {
    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    if (!exitingShoppingCart) {
      return null;
    }

    exitingShoppingCart.total_price = 0;

    for (let i = 0; i < exitingShoppingCart.products.length; i++) {
      const { product } = await this.productsService.findOneById(
        exitingShoppingCart.products[i].productId,
      );
      exitingShoppingCart.products[i].price = product.price;
      exitingShoppingCart.total_price +=
        product.price * exitingShoppingCart.products[i].count;
      exitingShoppingCart.discount =
        product.oldPrice > 0
          ? (product.oldPrice - product.price) *
            exitingShoppingCart.products[i].count
          : 0;
    }

    exitingShoppingCart.changed('products', true);

    return exitingShoppingCart;
  }

  async add(
    addToCartDto: AddToCartDto,
    userId: number,
  ): Promise<CartModel | { message: string }> {
    const { product } = await this.productsService.findOneById(
      addToCartDto.productId,
    );

    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    if (!exitingShoppingCart) {
      const newCart: {
        user: number;
        products: ProductCartDto[];
        total_price: number;
        discount: number;
      } = {
        user: userId,
        products: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            inStock: product.inStock - 1,
            image: product.images[0].url,
            count: 1,
            discount: product.discount,
          },
        ],
        total_price: product.price,
        discount: product.oldPrice > 0 ? product.oldPrice - product.price : 0,
      };

      return await this.cartModel.create(newCart);
    }

    const productIncludes: boolean = exitingShoppingCart.products.some(
      (p: ProductCartDto) => p.productId === product.id,
    );

    if (productIncludes) {
      return exitingShoppingCart;
    }

    const newProduct: ProductCartDto = {
      productId: product.id,
      name: product.name,
      price: product.price,
      inStock: product.inStock - 1,
      image: product.images[0].url,
      count: 1,
      discount: product.discount,
    };

    exitingShoppingCart.products = [
      ...exitingShoppingCart.products,
      newProduct,
    ];
    exitingShoppingCart.total_price += product.price;
    exitingShoppingCart.discount +=
      product.oldPrice > 0 ? product.oldPrice - product.price : 0;

    await exitingShoppingCart.save();

    return exitingShoppingCart;
  }

  async increaseCountAndTotalPrice(addToCartDto: AddToCartDto, userId: number) {
    const { product } = await this.productsService.findOneById(
      addToCartDto.productId,
    );

    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    const productIncludes: boolean = exitingShoppingCart.products.some(
      (p: ProductCartDto) => p.productId === product.id,
    );

    if (exitingShoppingCart && productIncludes) {
      const productInTheCart: ProductCartDto =
        exitingShoppingCart.products.find(
          (p: ProductCartDto) => p.productId === product.id,
        );

      if (productInTheCart.inStock > 0) {
        productInTheCart.count += 1;

        productInTheCart.inStock -= 1;

        exitingShoppingCart.total_price += product.price;
        exitingShoppingCart.discount +=
          product.oldPrice > 0 ? product.oldPrice - product.price : 0;

        exitingShoppingCart.changed('products', true);

        return await exitingShoppingCart.save();
      }

      return exitingShoppingCart;
    }
  }

  async decreaseCountAndTotalPrice(addToCartDto: AddToCartDto, userId: number) {
    const { product } = await this.productsService.findOneById(
      addToCartDto.productId,
    );

    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    const productIncludes: boolean = exitingShoppingCart.products.some(
      (p: ProductCartDto) => p.productId === product.id,
    );

    if (exitingShoppingCart && productIncludes) {
      const productInTheCart: ProductCartDto =
        exitingShoppingCart.products.find(
          (p: ProductCartDto) => p.productId === product.id,
        );

      if (productInTheCart.inStock < product.inStock - 1) {
        productInTheCart.count -= 1;

        productInTheCart.inStock += 1;

        exitingShoppingCart.total_price -= product.price;
        exitingShoppingCart.discount -=
          product.oldPrice > 0 ? product.oldPrice - product.price : 0;

        exitingShoppingCart.changed('products', true);

        return await exitingShoppingCart.save();
      }

      return exitingShoppingCart;
    }
  }

  async remove(productId: number, userId: number) {
    const { product } = await this.productsService.findOneById(productId);

    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    const productIncludes = exitingShoppingCart.products.find(
      (p: ProductCartDto) => p.productId === product.id,
    );

    if (exitingShoppingCart && productIncludes) {
      const productInTheCart: ProductCartDto =
        exitingShoppingCart.products.filter(
          (p: ProductCartDto) => p.productId !== product.id,
        );

      exitingShoppingCart.total_price -= product.price * productIncludes.count;
      exitingShoppingCart.discount -=
        product.oldPrice > 0
          ? (product.oldPrice - product.price) * productIncludes.count
          : 0;
      exitingShoppingCart.products = productInTheCart;

      return await exitingShoppingCart.save();
    }
  }

  async removeAll(userId: number): Promise<CartModel> {
    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    exitingShoppingCart.products = [];
    exitingShoppingCart.total_price = 0;
    exitingShoppingCart.discount = 0;

    return await exitingShoppingCart.save();
  }
}
