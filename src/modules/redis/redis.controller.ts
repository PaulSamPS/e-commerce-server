import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('set')
  async setValue(
    @Body('key') key: string,
    @Body('value') value: string,
  ): Promise<void> {
    await this.redisService.setValue(key, value);
  }

  @Get('get/:key')
  async getValue(@Param('key') key: string): Promise<string | null> {
    return this.redisService.getValue(key);
  }
}
