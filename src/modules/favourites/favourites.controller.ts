import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { FavouritesService } from '@/modules/favourites/favourites.service';
import { FavouritesDto } from '@/modules/favourites/dto/favourites.dto';
import { JwtService } from '@nestjs/jwt';
import { Cookies } from '@/decorators/cookies.decorator';

@Controller('favourites')
export class FavouritesController {
  constructor(
    private favouritesService: FavouritesService,
    private readonly jwtService: JwtService,
  ) {}

  private async getUserFromToken(accessToken: string) {
    return this.jwtService.decode(accessToken) || null;
  }
  @UseGuards(JwtAuthGuard)
  @Get('/get')
  async getUserFavourites(@Cookies('auth_access') token: string) {
    const { user } = await this.getUserFromToken(token);

    return this.favouritesService.get(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/add')
  async addUserFavourites(
    @Body() favouritesDto: FavouritesDto,
    @Cookies('auth_access') token: string,
  ) {
    const { user } = await this.getUserFromToken(token);

    return this.favouritesService.addFavourites(favouritesDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/remove')
  async removeUserFavourites(
    @Body() favouritesDto: FavouritesDto,
    @Cookies('auth_access') token: string,
  ) {
    const { user } = await this.getUserFromToken(token);

    return this.favouritesService.removeFavourites(favouritesDto, user.id);
  }
}
