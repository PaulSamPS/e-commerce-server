import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  readonly price: number;

  readonly oldPrice: number;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  readonly images: string;

  @IsNotEmpty()
  readonly inStock: number;

  readonly bestsellers: boolean;

  readonly isNew: boolean;

  @IsNotEmpty()
  readonly category: string;

  soldCount: number;

  discount: number;
}
