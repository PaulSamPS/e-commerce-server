import { Controller, Get, Param } from '@nestjs/common';
import { DayProductsService } from '@/modules/day-products/day-products.service';

@Controller('day-products')
export class DayProductsController {
  constructor(private readonly dayProductsService: DayProductsService) {}

  @Get('/set')
  setDayProducts() {
    return this.dayProductsService.setDayProducts();
  }

  @Get('/yesterday/set')
  async setYesterday() {
    return await this.dayProductsService.setYesterday();
  }

  @Get('/get')
  getDayProducts() {
    return this.dayProductsService.getDayProducts();
  }

  @Get('/get/:productName')
  getOneDayProducts(@Param('productName') productName: string) {
    console.log(productName);
    return this.dayProductsService.getOneDayProducts(productName);
  }

  @Get('/yesterday/get')
  getYesterdayProducts() {
    return this.dayProductsService.getYesterdayProducts();
  }
}
