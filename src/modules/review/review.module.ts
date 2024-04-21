import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewModel } from '@/modules/review/review.model';
import { ReviewController } from '@/modules/review/review.controller';
import { ProductsModule } from '@/modules/product';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([ReviewModel]), ProductsModule],
  providers: [ReviewService, JwtService],
  controllers: [ReviewController],
  exports: [ReviewService],
})
export class ReviewModule {}
