import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewModel } from '@/modules/review/review.model';
import { ReviewsDtoCreate } from '@/modules/review/dto/review.dto';
import { Op } from 'sequelize';
import { ProductService } from '@/modules/product';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel)
    private reviewsModel: typeof ReviewModel,
    private productService: ProductService,
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

      if (existingReview) {
        return {
          message: 'Вы уже оставляли отзыв о данном товаре',
          status: HttpStatus.CONFLICT,
        };
      }

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
        product,
        firstName,
        lastName,
        rating,
        review,
        approved: false,
      });
    } catch (error) {
      console.error('Ошибка при создании отзыва:', error);
      return {
        message: 'Внутренняя ошибка сервера при создании отзыва',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findAll(product: number) {
    const reviews = await this.reviewsModel.findAndCountAll({
      where: { product },
    });

    if (!reviews) {
      return {
        message: 'Пока еще никто не оставил отзыв',
        status: HttpStatus.CONFLICT,
      };
    }
    const { count, rows } = reviews;

    const rating = (
      rows.reduce((sum, item) => sum + item.rating, 0) / count
    ).toFixed(1);

    const sort = rows.sort(function (a, b) {
      return b.rating - a.rating;
    });

    return { sort, count, rating };
  }
}
