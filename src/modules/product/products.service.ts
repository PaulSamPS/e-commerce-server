import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductsModel } from './products.model';
import { CreateProductDto } from './dto/create-product.dto';
import { Includeable, Op } from 'sequelize';
import { IProductsQuery } from './types';
import { ReviewModel } from '@/modules/review/review.model';
import { FeaturesModel } from '@/modules/features/features.model';
import { FilesService } from '@/modules/files';
import { calculateDiscount } from './lib/calculate-discount';
import { UpdateProductDto } from '@/modules/product/dto/update-product.dto';
import { RedisService } from '@/modules/redis/redis.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductsModel)
    private productModel: typeof ProductsModel,
    private readonly fileService: FilesService,
    private readonly redisService: RedisService,
  ) {}

  private async processProductImages(
    productDto: CreateProductDto | UpdateProductDto,
    files: Express.Multer.File[],
  ) {
    return this.fileService.processAndSaveImages(
      files,
      productDto.name,
      'products',
    );
  }

  private updateProductFields(
    product: ProductsModel,
    updateProductDto: UpdateProductDto,
  ) {
    ['price', 'oldPrice', 'description', 'inStock', 'isNew', 'rating'].forEach(
      (field) => {
        if (updateProductDto[field] !== undefined) {
          product[field] = updateProductDto[field];
        }
      },
    );
  }

  private updateProductDiscount(
    product: ProductsModel,
    updateProductDto: UpdateProductDto,
  ) {
    if (
      updateProductDto.price !== undefined ||
      updateProductDto.oldPrice !== undefined
    ) {
      product.discount = calculateDiscount(
        updateProductDto.oldPrice ?? product.oldPrice,
        updateProductDto.price ?? product.price,
      );
    }
  }

  private async getReviewCount(productId: number): Promise<number> {
    return ReviewModel.count({ where: { product: productId } });
  }

  private async addReviewCountToProducts(products: ProductsModel[]) {
    return Promise.all(
      products.map(async (product) => {
        const reviewCount = await this.getReviewCount(product.id);
        return { ...product.toJSON(), reviewCount };
      }),
    );
  }

  private defaultIncludes(): Includeable[] {
    return [{ model: FeaturesModel, required: false }];
  }

  async recentlyViewed(productsId: number[]) {
    const products = await this.productModel.findAll({
      where: {
        id: {
          [Op.in]: productsId,
        },
      },
    });

    // Создаем объект Map для быстрого доступа к товарам по id
    const productMap = new Map();
    products.forEach((product) => {
      productMap.set(product.id, product);
    });

    // Формируем отсортированный массив товаров
    return productsId
      .map((id) => productMap.get(id))
      .filter((product) => product);
  }
  public async paginateAndFilter(query: IProductsQuery) {
    const limit = Number(query.limit || 10);
    const offset = Number(query.offset || 0);
    const products = await this.productModel.findAndCountAll({
      limit,
      offset,
      include: this.defaultIncludes(),
    });

    const resultProducts = await this.addReviewCountToProducts(products.rows);

    return { count: resultProducts.length, products: resultProducts };
  }

  public async findAll() {
    return this.productModel.findAll();
    // return await this.addReviewCountToProducts(products);
    // return products;
  }

  public async findNewProducts() {
    const products = await this.productModel.findAll({
      where: { isNew: true },
    });
    return this.addReviewCountToProducts(products);
  }

  public async findOneByName(name: string) {
    const cacheKey = `find_${name}`;
    const cachedData = await this.redisService.getValue(cacheKey);

    if (!cachedData) {
      const ttl = 3600;

      const product = await this.productModel.findOne({
        where: { name },
        include: this.defaultIncludes(),
      });
      if (!product) return null;

      const reviewCount = await this.getReviewCount(product.id);

      await this.redisService.setValue(
        cacheKey,
        JSON.stringify({ product, reviewCount }),
        ttl,
      );
      return { product, reviewCount };
    }

    return JSON.parse(cachedData);
  }

  public async findAllByCategory(category: string) {
    const products = await this.productModel.findAll({
      where: { category },
      include: this.defaultIncludes(),
    });
    return this.addReviewCountToProducts(products);
  }

  public async findOneById(id: number | string) {
    const product = await this.productModel.findOne({ where: { id } });
    if (!product) return null;
    const reviewCount = await this.getReviewCount(product.id);
    return { product, reviewCount };
  }

  public async searchByName(
    name: string,
  ): Promise<{ count: number; rows: ProductsModel[] }> {
    return this.productModel.findAndCountAll({
      limit: 10,
      where: { name: { [Op.iLike]: `%${name}%` } },
    });
  }

  public async createProduct(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<ProductsModel | { message: string; status: HttpStatus }> {
    try {
      const existingProduct = await this.findOneByName(createProductDto.name);
      if (existingProduct) {
        return {
          message: 'Товар с таким именем уже существует',
          status: HttpStatus.CONFLICT,
        };
      }

      const images = await this.processProductImages(createProductDto, files);

      const product = new ProductsModel({
        ...createProductDto,
        images,
        rating: 0,
        discount: calculateDiscount(
          createProductDto.oldPrice,
          createProductDto.price,
        ),
      });

      return await product.save();
    } catch (error) {
      console.error('Ошибка при создании продукта:', error);
      return {
        message:
          'Ошибка при создании продукта. Пожалуйста, попробуйте еще раз.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  public async updateProduct(
    productName: string,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ): Promise<ProductsModel | { message: string; status: HttpStatus }> {
    try {
      const existingProduct = await this.findOneByName(productName);
      if (!existingProduct) {
        return { message: 'Товар не найден', status: HttpStatus.NOT_FOUND };
      }

      if (files) {
        existingProduct.product.images = await this.processProductImages(
          updateProductDto,
          files,
        );
      }

      this.updateProductFields(existingProduct.product, updateProductDto);
      this.updateProductDiscount(existingProduct.product, updateProductDto);

      return await existingProduct.product.save();
    } catch (error) {
      console.error('Ошибка при обновлении продукта:', error);
      return {
        message:
          'Ошибка при обновлении продукта. Пожалуйста, попробуйте еще раз.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  public async getTopProducts() {
    const cacheKey = 'top_products';
    const cachedData = await this.redisService.getValue(cacheKey);

    if (!cachedData) {
      const ttl = 3600;

      const products = await this.productModel.findAll({
        where: { rating: { [Op.gt]: 4.7 }, isNew: false },
        include: this.defaultIncludes(),
        limit: 10,
      });

      if (products.length <= 0) {
        return { message: 'Продукты не найдены', status: HttpStatus.NOT_FOUND };
      }

      const topProducts = await this.addReviewCountToProducts(products);

      await this.redisService.setValue(
        cacheKey,
        JSON.stringify(topProducts),
        ttl,
      );

      return topProducts;
    }

    return JSON.parse(cachedData);
  }

  public async getProductsByCategory(category: string) {
    const products = await this.findAllByCategory(category);

    if (!products) {
      return { message: 'Продукты не найдены', status: HttpStatus.CONFLICT };
    }

    return products;
  }
}
