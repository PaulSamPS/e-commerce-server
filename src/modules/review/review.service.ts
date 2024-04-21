import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewModel } from '@/modules/review/review.model';
import { ReviewsDtoCreate } from '@/modules/review/dto/review.dto';
import { Op } from 'sequelize';
import { ProductsService } from '@/modules/product';
import { UsersService } from '@/modules/users';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel)
    private reviewsModel: typeof ReviewModel,
    private productService: ProductsService,
  ) {}

  async topProducts() {
    return await this.reviewsModel.findAll({
      where: { rating: { [Op.gt]: 4 } },
    });
  }

  async create(reviewsDtoCreate: ReviewsDtoCreate) {
    try {
      const { product, user, firstName, lastName, rating, review } =
        reviewsDtoCreate;

      // Проверяем, оставлял ли пользователь уже отзыв о данном товаре
      const existingReview = await this.reviewsModel.findOne({
        where: { product, user },
      });

      if (!existingReview) {
        // Находим все отзывы для данного товара
        const productReviews = await this.reviewsModel.findAndCountAll({
          where: { product },
        });

        // Получаем информацию о товаре
        const productInstance = await this.productService.findOneById(product);

        if (!productInstance) {
          return {
            message: 'Продукт не найден',
            status: HttpStatus.NOT_FOUND,
          };
        }

        // Обновляем рейтинг товара
        const totalReviews = productReviews.count;
        const totalRating = productReviews.rows.reduce(
          (sum, item) => sum + item.rating,
          0,
        );
        const newRating = ((totalRating + rating) / (totalReviews + 1)).toFixed(
          1,
        );
        productInstance.rating = Number(newRating);
        await productInstance.save();

        // Создаем новый отзыв
        return await this.reviewsModel.create({
          user,
          product,
          firstName,
          lastName,
          rating,
          review,
          approved: false,
        });
      }

      return {
        message: 'Вы уже оставляли отзыв о данном товаре',
        status: HttpStatus.CONFLICT,
      };
    } catch (error) {
      console.error('Ошибка при создании отзыва:', error);
      return {
        message: 'Внутренняя ошибка сервера при создании отзыва',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findAll(product: number) {
    const reviews = await this.fetchReviews(product);

    if (!reviews) {
      return this.noReviewsFoundResponse();
    }

    const { count, rows } = reviews;
    const averageRating = this.calculateRating(rows, count);
    const sortedReviews = this.sortReviewsByRating(rows);

    return { sortedReviews, count, averageRating };
  }

  private async fetchReviews(product: number) {
    return await this.reviewsModel.findAndCountAll({ where: { product } });
  }

  private noReviewsFoundResponse() {
    return {
      message: 'Пока еще никто не оставил отзыв',
      status: HttpStatus.CONFLICT,
    };
  }

  private calculateRating(reviews: ReviewModel[], count: number) {
    const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
    return (totalRating / count).toFixed(1);
  }

  private sortReviewsByRating(reviews: ReviewModel[]) {
    return reviews.sort((a, b) => b.rating - a.rating);
  }
}
