import { ApiProperty } from '@nestjs/swagger';
import { ProductsModel } from '@/modules/product/products.model';

const EXAMPLE_PRODUCT = {
  id: 3,
  oldPrice: 0,
  bestseller: false,
  isNew: true,
  soldCount: 0,
  price: 25000,
  name: 'Dean',
  description:
    'У нас не всегда получаеться написать красивое описания к каждому стулу, но мы выкладываем живые фото готовых изделий на которых Вы можете рассмотреть качество сделанной работы и почувствовать добрые чувства с которыми сделаны стулья на основе каркасов Konyshev. Мы единственная в России группа инженеров занимающаяся проектированием и производством каркасов для мягкой мебели.',
  images: [
    {
      url: '/static/products/Dean 3/b3b63909-0f8f-4ddd-9396-72cfc761183c.webp',
      name: 'b3b63909-0f8f-4ddd-9396-72cfc761183c.webp',
    },
    {
      url: '/static/products/Dean 3/6acfdcb8-cd39-4962-a11a-87a67a436a05.webp',
      name: '6acfdcb8-cd39-4962-a11a-87a67a436a05.webp',
    },
    {
      url: '/static/products/Dean 3/1f6c426a-2231-411a-bcfe-19c7a8c6fa45.webp',
      name: '1f6c426a-2231-411a-bcfe-19c7a8c6fa45.webp',
    },
    {
      url: '/static/products/Dean 3/bdaa6867-146a-41a2-8a76-d9674e014fc5.webp',
      name: 'bdaa6867-146a-41a2-8a76-d9674e014fc5.webp',
    },
  ],
  inStock: 10,
  category: 'styl',
  rating: 5,
  discount: 0,
  updatedAt: '2024-04-21T00:14:21.201Z',
  createdAt: '2024-04-21T00:14:21.201Z',
};

export class ProductResponseType {
  @ApiProperty({
    example: EXAMPLE_PRODUCT,
    description: 'Информация о товаре',
  })
  product: ProductsModel;
}

export class ProductResponseTypeArray {
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
