import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';
import { FilesService } from '@/modules/files';
import { SharesService } from '@/modules/shares/shares.service';
import { SharesModel } from '@/modules/shares/shares.model';
import { SharesDto } from '@/modules/shares/dto/shares.dto';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { AdminGuard } from '@/guards/admin.guard';

@Controller('shares')
export class SharesController {
  constructor(
    private readonly sharesService: SharesService,
    private readonly fileService: FilesService,
  ) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  @UseInterceptors(FilesInterceptor('image'))
  async createShares(
    @Body() sharesDto: SharesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<SharesModel | { message: string; status: HttpStatus }> {
    console.log(files);
    const convertedImages: FileElementResponse =
      await this.fileService.processAndSaveOneImage(
        files,
        sharesDto.name,
        'shares',
      );
    return this.sharesService.create(sharesDto, convertedImages);
  }

  @Get('')
  getShares(): Promise<SharesModel[]> {
    return this.sharesService.getShares();
  }
}
