import { ApiProperty } from '@nestjs/swagger';
import { ReviewModel } from '@/modules/review/review.model';

const EXAMPLE_REVIEW_DATA = {
  id: 1,
  user: 1,
  product: 1,
  firstName: 'Кто-то',
  lastName: 'Кто-то еще',
  rating: 5,
  review: 'Текст отзыва',
  approved: false,
  updatedAt: '2024-04-21T05:12:06.643Z',
  createdAt: '2024-04-21T05:12:06.643Z',
};

export class SingleReviewResponse {
  @ApiProperty({
    example: EXAMPLE_REVIEW_DATA,
    description: 'Информация об одном отзыве',
  })
  review: ReviewModel;
}

export class MultipleReviewsResponse {
  @ApiProperty({
    example: [EXAMPLE_REVIEW_DATA],
    description: 'Массив отзывов',
  })
  sortedReviews: ReviewModel[];

  @ApiProperty({
    example: 1,
    description: 'Количество отзывов',
  })
  count: number;

  @ApiProperty({
    example: 5,
    description: 'Средний рейтинг отзывов',
  })
  averageRating: number;
}
