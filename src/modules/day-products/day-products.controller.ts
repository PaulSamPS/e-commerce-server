import { Controller, Get, Param } from '@nestjs/common';
import { DayProductsService } from '@/modules/day-products/day-products.service';
import { Cron } from '@nestjs/schedule';

@Controller('day-products')
export class DayProductsController {
  constructor(private readonly dayProductsService: DayProductsService) {}

  @Cron('0 0 * * *', { name: 'dayProducts', timeZone: 'Europe/Moscow' })
  async setDayProducts() {
    await this.dayProductsService.setYesterday();
    return this.dayProductsService.setDayProducts();
  }

  @Get()
  getDayProducts() {
    return this.dayProductsService.getDayProducts();
  }

  @Get('find/:productName')
  getOneDayProducts(@Param('productName') productName: string) {
    return this.dayProductsService.getOneDayProducts(productName);
  }

  @Get('yesterday')
  getYesterdayProducts() {
    console.log('999');
    return this.dayProductsService.getYesterdayProducts();
  }
}
