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
import { FeaturesService } from './features.service';
import { FeaturesDtoCreate } from '@/modules/features/dto/features.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FeaturesResponseType } from './features-response.type';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { AdminGuard } from '@/guards/admin.guard';

@ApiTags('Features')
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @ApiOkResponse({ type: FeaturesResponseType })
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  async createFeatures(@Body() featuresCreateDto: FeaturesDtoCreate) {
    return this.featuresService.create(featuresCreateDto);
  }

  @ApiOkResponse({ type: FeaturesResponseType })
  @Get('/:productName')
  getOne(@Param('productName') productName: string) {
    return this.featuresService.findOneByName(productName);
  }
}
