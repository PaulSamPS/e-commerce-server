export class UpdateProductDto {
  readonly price: number;

  readonly oldPrice: number;

  readonly name: string;

  readonly description: string;

  readonly images: string;

  readonly inStock: number;

  readonly bestsellers: boolean;

  readonly isNew: boolean;

  readonly category: string;

  readonly soldCount: number;

  readonly discount: number;

  readonly rating: number;
}
