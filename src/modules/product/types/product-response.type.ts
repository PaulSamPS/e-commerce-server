import { ApiProperty } from '@nestjs/swagger';
import { ProductsModel } from '@/modules/product/products.model';

const EXAMPLE_PRODUCT = {
  id: 1,
  price: 25000,
  oldPrice: 0,
  name: 'Dean',
  description:
    'У нас не всегда получаеться написать красивое описания к каждому стулу, но мы выкладываем живые фото готовых изделий на которых Вы можете рассмотреть качество сделанной работы и почувствовать добрые чувства с которыми сделаны стулья на основе каркасов Konyshev. Мы единственная в России группа инженеров занимающаяся проектированием и производством каркасов для мягкой мебели.',
  images: [
    {
      url: '/static/products/Dean/4a5f940a-f340-408d-b3d8-2d67df0569cd.webp',
      name: '4a5f940a-f340-408d-b3d8-2d67df0569cd.webp',
    },
    {
      url: '/static/products/Dean/4d858428-13ef-40c5-8656-8a25ce23b9cc.webp',
      name: '4d858428-13ef-40c5-8656-8a25ce23b9cc.webp',
    },
    {
      url: '/static/products/Dean/ab8782a0-a3a0-4420-bd82-583c4000317a.webp',
      name: 'ab8782a0-a3a0-4420-bd82-583c4000317a.webp',
    },
    {
      url: '/static/products/Dean/2f923aef-fdc1-4a33-9373-87cab1f2d017.webp',
      name: '2f923aef-fdc1-4a33-9373-87cab1f2d017.webp',
    },
  ],
  inStock: 10,
  bestseller: false,
  isNew: true,
  soldCount: 0,
  rating: 4.5,
  discount: 0,
  category: 'styl',
  createdAt: '2024-04-21T04:54:20.760Z',
  updatedAt: '2024-04-21T19:36:18.822Z',
  features: {
    id: 1,
    productName: null,
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
    createdAt: '2024-04-21T12:46:26.360Z',
    updatedAt: '2024-04-21T12:46:26.360Z',
    product: 1,
  },
  reviewCount: 2,
};

export class ProductResponseType {}

export class ProductResponseTypeArray {
  @ApiProperty({
    example: 1,
    description: 'Информация о товаре',
  })
  count: 1;

  @ApiProperty({
    example: EXAMPLE_PRODUCT,
    description: 'Массив товаров',
  })
  products: ProductsModel[];
}

export class ProductResponseTypePaginate {
  @ApiProperty({
    example: {
      rows: [EXAMPLE_PRODUCT],
    },
    description: 'Пагинированный список товаров',
  })
  products: ProductsModel[];

  @ApiProperty({
    example: {
      count: 1,
    },
    description: 'Общее количество товаров',
  })
  count: number;
}
