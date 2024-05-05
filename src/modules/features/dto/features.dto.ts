import { IsNotEmpty } from 'class-validator';

export class FeaturesArr {
  name: string;
  value: string;
}

export class FeaturesDtoCreate {
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  product: number;

  @IsNotEmpty()
  features: FeaturesArr[];
}
