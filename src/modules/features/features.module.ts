import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FeaturesModel } from './features.model';
import { FeaturesController } from '@/modules/features/features.controller';
import { ProductsModule } from '@/modules/product';

@Module({
  imports: [SequelizeModule.forFeature([FeaturesModel]), ProductsModule],
  providers: [FeaturesService],
  controllers: [FeaturesController],
  exports: [FeaturesService],
})
export class FeaturesModule {}
