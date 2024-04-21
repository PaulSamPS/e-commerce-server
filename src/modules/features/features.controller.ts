import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesDtoCreate } from '@/modules/features/dto/features.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FeaturesResponseType } from './features-response.type';

@ApiTags('Features')
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @ApiOkResponse({ type: FeaturesResponseType })
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  async createFeatures(@Body() featuresCreateDto: FeaturesDtoCreate) {
    return this.featuresService.create(featuresCreateDto);
  }

  @ApiOkResponse({ type: FeaturesResponseType })
  @Get('find/:productId')
  getOne(@Param('productId') productId: number) {
    return this.featuresService.findOneByName(productId);
  }
}
