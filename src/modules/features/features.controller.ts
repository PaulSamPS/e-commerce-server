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

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  async createFeatures(@Body() featuresCreateDto: FeaturesDtoCreate) {
    return this.featuresService.create(featuresCreateDto);
  }

  @Get('find/:name')
  getOne(@Param('name') name: string) {
    return this.featuresService.findOneByName(name);
  }
}
