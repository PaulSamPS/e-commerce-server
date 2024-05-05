import { Injectable } from '@nestjs/common';
import { FeaturesDtoCreate } from '@/modules/features/dto/features.dto';
import { FeaturesModel } from '@/modules/features/features.model';
import { InjectModel } from '@nestjs/sequelize';
import { ProductsService } from '@/modules/product';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectModel(FeaturesModel)
    private featuresModel: typeof FeaturesModel,
    private readonly productService: ProductsService,
  ) {}

  async create(featuresDto: FeaturesDtoCreate) {
    try {
      const existingFeatures = await this.featuresModel.findOne({
        where: { product: featuresDto.product },
      });

      if (existingFeatures) {
        throw new Error('Характеристики для данного продукта уже существуют');
      }

      const { product } = await this.productService.findOneById(
        featuresDto.product,
      );

      if (!product) {
        throw new Error('Продукт не найден');
      }

      const newFeatures = new FeaturesModel({
        features: featuresDto.features,
        product: product.id,
        productName: product.name,
      });

      await newFeatures.save();

      return newFeatures;
    } catch (error) {
      console.error('Ошибка при создании характеристик:', error);
      throw new Error('Внутренняя ошибка сервера при создании характеристик');
    }
  }

  async findOneByName(productName: string) {
    try {
      const features = await this.featuresModel.findOne({
        where: { productName: productName },
      });

      if (!features) {
        throw new Error('Характеристики не найдены');
      }

      return features.features;
    } catch (error) {
      console.error('Ошибка при поиске характеристик:', error);
      throw new Error('Внутренняя ошибка сервера при поиске характеристик');
    }
  }
}
