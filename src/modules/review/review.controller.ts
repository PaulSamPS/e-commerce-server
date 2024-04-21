import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from '@/modules/review/review.service';
import { ReviewsDtoCreate } from './dto/review.dto';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  MultipleReviewsResponse,
  SingleReviewResponse,
} from '@/modules/review/reviews.type';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @ApiOkResponse({ type: SingleReviewResponse })
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  async createFeatures(@Body() reviewsDtoCreate: ReviewsDtoCreate) {
    return this.reviewService.create(reviewsDtoCreate);
  }

  @ApiOkResponse({ type: MultipleReviewsResponse })
  @Get(':product')
  getAll(@Param('product') product: number) {
    return this.reviewService.findAll(product);
  }
}
