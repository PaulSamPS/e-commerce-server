import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FavouritesModel } from '@/modules/favourites/favourites.model';
import { FavouritesDto } from '@/modules/favourites/dto/favourites.dto';
import { FavouritesProductDto } from '@/modules/favourites/dto/favouritesProduct.dto';
import { ProductsService } from '@/modules/product';
import { ProductCartDto } from '@/modules/cart/dto/productCart.dto';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectModel(FavouritesModel)
    private favouritesModel: typeof FavouritesModel,
    private readonly productsService: ProductsService,
  ) {}

  async get(userId: number) {
    const exitingFavourites = await this.favouritesModel.findOne({
      where: { user: userId },
    });

    if (!exitingFavourites) {
      const newFavourites: {
        user: number;
        products: FavouritesProductDto[];
      } = {
        user: userId,
        products: [],
      };
      return await this.favouritesModel.create(newFavourites);
    }

    return exitingFavourites;
  }

  async addFavourites(favouritesDto: FavouritesDto, userId: number) {
    const exitingFavourites = await this.favouritesModel.findOne({
      where: { user: userId },
    });

    const product = await this.productsService.findOneById(
      favouritesDto.productId,
    );

    const productIncludes: boolean = exitingFavourites.products.some(
      (p: ProductCartDto) => p.productId === product.product.id,
    );

    if (!exitingFavourites && !productIncludes) {
      const newFavourites: {
        user: number;
        products: FavouritesProductDto[];
      } = {
        user: userId,
        products: [
          {
            productId: product.product.id,
            name: product.product.name,
            image: product.product.images[0].url,
          },
        ],
      };

      return await this.favouritesModel.create(newFavourites);
    }

    const newFavourites: FavouritesProductDto = {
      productId: product.product.id,
      name: product.product.name,
      image: product.product.images[0].url,
    };

    exitingFavourites.products = [...exitingFavourites.products, newFavourites];

    await exitingFavourites.save();

    return exitingFavourites;
  }

  async removeFavourites(favouritesDto: FavouritesDto, userId: number) {
    const exitingFavourites = await this.favouritesModel.findOne({
      where: { user: userId },
    });

    exitingFavourites.products = exitingFavourites.products.filter(
      (i) => i.productId !== favouritesDto.productId,
    );

    await exitingFavourites.save();

    return exitingFavourites;
  }
}
