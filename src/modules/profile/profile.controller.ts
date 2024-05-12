import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ProfileService } from '@/modules/profile/profile.service';
import { ProfileDto } from '@/modules/profile/dto/profile.dto';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { ProfileModel } from '@/modules/profile/profile.model';
import { Cookies } from '@/decorators/cookies.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) {}

  private async getUserFromToken(accessToken: string) {
    return this.jwtService.decode(accessToken) || null;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async update(
    @Body() profileDto: ProfileDto,
    @Cookies('auth_access') token: string,
  ): Promise<ProfileModel> {
    const { user } = await this.getUserFromToken(token);

    return this.profileService.updateProfile(user.id, profileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Cookies('auth_access') token: string) {
    const { user } = await this.getUserFromToken(token);

    return await this.profileService.getProfile(user.id);
  }
}
