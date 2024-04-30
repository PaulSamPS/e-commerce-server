import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { AdminGuard } from '@/guards/admin.guard';
import {
  ProductResponseType,
  ProductResponseTypeArray,
  ProductResponseTypePaginate,
} from '@/modules/product/types/product-response.type';
import { ProductsModel } from '@/modules/product/products.model';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @ApiCookieAuth('auth_access')
  @ApiOkResponse({ type: ProductResponseType })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images'))
  async createFurniture(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files);
    return this.productService.createProduct(createProductDto, files);
  }

  @ApiCookieAuth('auth_access')
  @ApiOkResponse({ type: ProductResponseType })
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Patch('/update/:productName')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  @UseInterceptors(FilesInterceptor('images'))
  async updateProduct(
    @Param('productName') productName: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.updateProduct(
      productName,
      updateProductDto,
      files,
    );
  }

  @ApiOkResponse({ type: ProductResponseTypePaginate })
  @Get('/all')
  getAll(@Query() query) {
    return this.productService.paginateAndFilter(query);
  }

  @ApiOkResponse({ type: ProductResponseType })
  @Get('find/:name')
  getOne(@Param('name') name: string) {
    return this.productService.findOneByName(name);
  }

  @ApiOkResponse({ type: ProductResponseType })
  @Get('new')
  getNew() {
    return this.productService.findNewProducts();
  }

  @ApiOkResponse({ type: ProductResponseType })
  @Post('search')
  search(@Body() { productName }: { productName: string }) {
    return this.productService.searchByName(productName);
  }

  @ApiOkResponse({ type: ProductResponseType })
  @Post('name')
  getByName(@Body() { name }: { name: string }) {
    return this.productService.findOneByName(name);
  }

  @ApiOkResponse({ type: ProductResponseTypeArray })
  @Get('top-products')
  async topProducts() {
    return await this.productService.getTopProducts();
  }

  @ApiOkResponse({ type: ProductResponseTypeArray })
  @Get('/:category')
  getProductsByCategory(@Param('category') category: string) {
    return this.productService.getProductsByCategory(category);
  }
}
