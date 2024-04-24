import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SharesModel } from '@/modules/shares/shares.model';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';
import { SharesDto } from '@/modules/shares/dto/shares.dto';

@Injectable()
export class SharesService {
  constructor(
    @InjectModel(SharesModel)
    private readonly sharesModel: typeof SharesModel,
  ) {}

  async findOneByName(name: string): Promise<SharesModel | null> {
    return this.sharesModel.findOne({ where: { name } });
  }

  async create(sharesDto: SharesDto, files: FileElementResponse) {
    const existingBySharesName = await this.findOneByName(sharesDto.name);

    if (existingBySharesName) {
      return {
        message: 'Такая акция уже существует',
        status: HttpStatus.CONFLICT,
      };
    }

    return await this.sharesModel.create({
      ...sharesDto,
      images: files,
    });
  }

  async getShares(): Promise<SharesModel[]> {
    return this.sharesModel.findAll();
  }
}
