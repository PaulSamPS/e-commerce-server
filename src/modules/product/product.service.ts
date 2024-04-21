import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { Op } from 'sequelize';
import { IProductsQuery } from './types';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';
import { ReviewModel } from '@/modules/review/review.model';
import { FeaturesModel } from '@/modules/features/features.model';
import { MFile } from '@/modules/files/mfile.class';
import { FilesService } from '@/modules/files';
import { calculateDiscount } from './lib/calculate-discount';
import { UpdateProductDto } from '@/modules/product/dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private productModel: typeof ProductModel,
    private readonly fileService: FilesService,
  ) {}

  private defaultIncludes() {
    return [
      { model: ReviewModel, required: false },
      { model: FeaturesModel, required: false },
    ];
  }

  async paginateAndFilter(
    query: IProductsQuery,
  ): Promise<{ count: number; rows: ProductModel[] }> {
    const limit: number = +query.limit;
    const offset: number = +query.offset;
    return this.productModel.findAndCountAll({
      limit,
      offset,
    });
  }

  async findNewProducts(): Promise<{ count: number; rows: ProductModel[] }> {
    return this.productModel.findAndCountAll({
      where: { isNew: true },
    });
  }

  async findOneByName(name: string): Promise<ProductModel> {
    return this.productModel.findOne({
      where: { name },
      include: this.defaultIncludes(),
    });
  }

  async findAllByCategory(category: string): Promise<ProductModel[]> {
    return this.productModel.findAll({
      where: { category },
      include: this.defaultIncludes(),
    });
  }

  async findOneById(id: number | string): Promise<ProductModel> {
    return this.productModel.findOne({ where: { id } });
  }

  async searchByName(
    name: string,
  ): Promise<{ count: number; rows: ProductModel[] }> {
    return await this.productModel.findAndCountAll({
      limit: 20,
      where: { name: { [Op.iLike]: `%${name}%` } },
    });
  }

  async createProduct(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<ProductModel | { message: string; status: HttpStatus }> {
    try {
      const imagesArr: MFile[] = await this.fileService.convertToWebp(files);
      const convertedImages: FileElementResponse[] =
        await this.fileService.saveFile(
          imagesArr,
          createProductDto.name,
          'products',
        );
      // Проверяем, существует ли товар с таким именем
      const existingProduct = await this.findOneByName(createProductDto.name);

      if (existingProduct) {
        return {
          message: 'Товар с таким именем уже существует',
          status: HttpStatus.CONFLICT,
        };
      }

      // Создаем новый экземпляр модели
      const product = new ProductModel({
        price: createProductDto.price,
        oldPrice: createProductDto.oldPrice,
        name: createProductDto.name,
        description: createProductDto.description,
        images: convertedImages,
        inStock: createProductDto.inStock,
        bestseller: createProductDto.bestsellers,
        isNew: createProductDto.isNew,
        category: createProductDto.category,
        rating: 0,
        discount: calculateDiscount(
          createProductDto.oldPrice,
          createProductDto.price,
        ),
      });

      // Сохраняем созданный продукт
      return await product.save();
    } catch (error) {
      console.error('Ошибка при создании продукта:', error);
      return {
        message: 'Внутренняя ошибка сервера при создании продукта',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async updateProduct(
    productName: string,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ): Promise<ProductModel | { message: string; status: HttpStatus }> {
    try {
      let convertedImages: FileElementResponse[];
      if (files) {
        const imagesArr: MFile[] = await this.fileService.convertToWebp(files);
        convertedImages = await this.fileService.saveFile(
          imagesArr,
          updateProductDto.name,
          'products',
        );
      }
      // Находим существующий продукт по имени
      const existingProduct = await this.findOneByName(productName);

      if (!existingProduct) {
        return {
          message: 'Товар не найден',
          status: HttpStatus.NOT_FOUND,
        };
      }

      // Обновляем поля продукта на основе данных из DTO
      if (updateProductDto.price !== undefined) {
        existingProduct.price = updateProductDto.price;
        existingProduct.discount = calculateDiscount(
          existingProduct.oldPrice,
          updateProductDto.price,
        );
      }

      if (updateProductDto.oldPrice !== undefined) {
        existingProduct.oldPrice = updateProductDto.oldPrice;
        existingProduct.discount = calculateDiscount(
          updateProductDto.oldPrice,
          existingProduct.price,
        );
      }

      if (updateProductDto.description !== undefined) {
        existingProduct.description = updateProductDto.description;
      }

      if (convertedImages !== undefined) {
        existingProduct.images = convertedImages;
      }

      if (updateProductDto.inStock !== undefined) {
        existingProduct.inStock = updateProductDto.inStock;
      }

      if (updateProductDto.isNew !== undefined) {
        existingProduct.isNew = updateProductDto.isNew;
      }

      if (updateProductDto.rating !== undefined) {
        existingProduct.rating = updateProductDto.rating;
      }

      // Сохраняем обновленный продукт
      return await existingProduct.save();
    } catch (error) {
      console.error('Ошибка при обновлении продукта:', error);
      return {
        message: 'Внутренняя ошибка сервера при обновлении продукта',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getTopProducts() {
    const products = await this.productModel.findAll({
      where: { rating: { [Op.gt]: 4 }, isNew: false },
      include: this.defaultIncludes(),
    });

    if (products.length <= 0) {
      return {
        message: 'Продукты не найдены',
        status: HttpStatus.CONFLICT,
      };
    }

    return products;
  }

  async getProductsByCategory(category: string) {
    const products = await this.findAllByCategory(category);

    if (!products) {
      return {
        message: 'Продукты не найдены',
        status: HttpStatus.CONFLICT,
      };
    }

    return products;
  }
}
