import { Module } from '@nestjs/common';
import { DayProductsController } from './day-products.controller';
import { DayProductsService } from './day-products.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DayProducts } from '@/modules/day-products/day-products.model';
import { ProductsModule } from '@/modules/product';

@Module({
  imports: [SequelizeModule.forFeature([DayProducts]), ProductsModule],
  controllers: [DayProductsController],
  providers: [DayProductsService],
  exports: [DayProductsService],
})
export class DayProductsModule {}
