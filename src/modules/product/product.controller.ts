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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  ProductRequest,
  PaginateAndFilters,
  FindOneResponse,
  ProductResponse,
  GetByNameRequest,
  GetByNameResponse,
  NewResponse,
  SearchRequest,
  SearchResponse,
} from './types';
import { ProductModel } from './product.model';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { AdminGuard } from '@/guards/admin.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBody({ type: ProductRequest })
  @ApiOkResponse({ type: ProductResponse })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images'))
  async createFurniture(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.createProduct(createProductDto, files);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
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

  @ApiOkResponse({ type: PaginateAndFilters })
  @Get()
  getAll(@Query() query): Promise<{ count: number; rows: ProductModel[] }> {
    return this.productService.paginateAndFilter(query);
  }

  @ApiOkResponse({ type: FindOneResponse })
  @Get('find/:name')
  getOne(@Param('name') name: string): Promise<ProductModel> {
    return this.productService.findOneByName(name);
  }

  @ApiOkResponse({ type: NewResponse })
  @Get('new')
  getNew(): Promise<{ count: number; rows: ProductModel[] }> {
    return this.productService.findNewProducts();
  }

  @ApiBody({ type: SearchRequest })
  @ApiOkResponse({ type: SearchResponse })
  @Post('search')
  search(@Body() { productName }: { productName: string }) {
    return this.productService.searchByName(productName);
  }

  @ApiBody({ type: GetByNameRequest })
  @ApiOkResponse({ type: GetByNameResponse })
  @Post('name')
  getByName(@Body() { name }: { name: string }) {
    return this.productService.findOneByName(name);
  }

  @Get('top-products')
  async topProducts() {
    return await this.productService.getTopProducts();
  }

  @Get('/category/:category')
  getProductsByCategory(@Param('category') category: string) {
    return this.productService.getProductsByCategory(category);
  }
}
