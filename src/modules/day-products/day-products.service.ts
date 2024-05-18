import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DayProducts } from '@/modules/day-products/day-products.model';
import { ProductsService } from '@/modules/product';
import { ProductsModel } from '@/modules/product/products.model';
import { ReviewModel } from '@/modules/review/review.model';
import { RedisService } from '@/modules/redis/redis.service';

@Injectable()
export class DayProductsService {
  constructor(
    @InjectModel(DayProducts)
    private dayProductsModel: typeof DayProducts,
    private readonly productService: ProductsService,
    private readonly redisService: RedisService,
  ) {}

  async setDayProducts() {
    const dayProductsModel = new DayProducts();
    const existingDayProducts = await this.dayProductsModel.findOne();
    const product = await this.productService.findAll();

    if (!product || !existingDayProducts) {
      dayProductsModel.dayProducts = [];
      return await dayProductsModel.save();
    }

    const dayProducts = [];

    const p = product.map((i) => i);

    for (let i = 0; dayProducts.length < 3; i++) {
      const ind = Math.trunc(Math.random() * p.length);
      const item = p[ind];
      const newProduct = product.find((p) => p.id === item.id);
      const discount = Math.floor(Math.random() * (20 - 5 + 1) + 5);
      const includeItems = existingDayProducts.productsYesterday.some(
        (o: ProductsModel) => o.id === item.id,
      );
      if (!includeItems) {
        newProduct.discount = discount;
        newProduct.oldPrice = item.price;
        newProduct.price = Math.floor(
          item.price - (item.price / 100) * discount,
        );
        await newProduct.save();

        const reviewCount = await ReviewModel.count({
          where: { product: p[ind].id },
        });
        dayProducts.push({ ...p.splice(ind, 1)[0].toJSON(), reviewCount });
      }
      existingDayProducts.dayProducts = dayProducts;
    }
    return await existingDayProducts.save();
  }

  async setYesterday() {
    const existingDayProducts = await this.dayProductsModel.findOne();
    const product = await this.productService.findAll();
    const yesterday = [];

    existingDayProducts.productsYesterday = existingDayProducts.dayProducts;

    const productsYesterday = existingDayProducts.dayProducts.map(
      (i: ProductsModel) => i,
    );
    for (let i = 0; i < 3; i++) {
      const item = productsYesterday[i].id;
      const newProduct = product.find((p) => p.id === item);
      newProduct.price = productsYesterday[i].oldPrice;
      newProduct.discount = 0;
      newProduct.oldPrice = 0;

      const reviewCount = await ReviewModel.count({
        where: { product: newProduct.id },
      });
      await newProduct.save();

      yesterday.push({ ...newProduct.toJSON(), reviewCount });
    }

    await existingDayProducts.save();

    return yesterday;
  }

  async getDayProducts(): Promise<any> {
    const cacheKey = 'day_products';
    const cachedData = await this.redisService.getValue(cacheKey);

    if (!cachedData) {
      const ttl = 3600;

      const products = await this.dayProductsModel.findOne();
      await this.redisService.setValue(
        cacheKey,
        JSON.stringify(products.dayProducts),
        ttl,
      );
      return products.dayProducts;
    }

    return JSON.parse(cachedData);
  }

  async getOneDayProducts(productName: string) {
    const products = await this.dayProductsModel.findOne();

    const dayProduct = products.dayProducts.find(
      (product: ProductsModel) => product.name === productName,
    );

    if (!dayProduct) {
      return products.dayProducts[0];
    }

    return dayProduct;
  }

  async getYesterdayProducts() {
    const products = await this.dayProductsModel.findOne();
    return products.productsYesterday;
  }
}
