import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FeaturesModel } from './features.model';
import { FeaturesController } from '@/modules/features/features.controller';
import { ProductsModule } from '@/modules/product';
import { DayProductsModule } from '@/modules/day-products/day-products.module';

@Module({
  imports: [
    SequelizeModule.forFeature([FeaturesModel]),
    ProductsModule,
    DayProductsModule,
  ],
  providers: [FeaturesService],
  controllers: [FeaturesController],
  exports: [FeaturesService],
})
export class FeaturesModule {}
