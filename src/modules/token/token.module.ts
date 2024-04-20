import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from './jwt-token.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokensModel } from '@/modules/token/token.model';
import { TokenService } from '@/modules/token/token.service';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([TokensModel])],
  providers: [JwtTokenService, JwtService, TokenService],
  exports: [JwtTokenService, JwtService],
})
export class TokenModule {}
