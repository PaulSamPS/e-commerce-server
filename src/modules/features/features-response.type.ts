import { ApiProperty } from '@nestjs/swagger';
import { ProductsModel } from '@/modules/product/products.model';
import { FeaturesModel } from '@/modules/features/features.model';

const EXAMPLE_FEATURES = {
  id: 1,
  features: [
    {
      name: 'Каркас',
      value: 'Фанера',
    },
    {
      name: 'Материал ножек',
      value: 'Бук',
    },
    {
      name: 'Материал обивки',
      value: 'Велюр',
    },
    {
      name: 'Страна производства',
      value: 'Россия',
    },
    {
      name: 'Гарантия',
      value: '1 год',
    },
  ],
  product: 1,
  updatedAt: '2024-04-21T12:46:26.360Z',
  createdAt: '2024-04-21T12:46:26.360Z',
};

export class FeaturesResponseType {
  @ApiProperty({
    example: EXAMPLE_FEATURES,
    description: 'Характеристики товара',
  })
  features: FeaturesModel;
}
