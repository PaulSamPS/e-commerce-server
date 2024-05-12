import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileModel } from '@/modules/profile/profile.model';
import { ProfileDto } from '@/modules/profile/dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(ProfileModel)
    private readonly profileModel: typeof ProfileModel,
  ) {}
  async updateProfile(userId: number, profileDto: ProfileDto) {
    const existingProfile = await this.profileModel.findOne({
      where: { user: userId },
    });

    if (!existingProfile) {
      const newProfile = {
        user: userId,
        firstname: profileDto.firstname,
        lastname: profileDto.lastname,
        middleName: profileDto.middleName,
        phoneNumber: profileDto.phoneNumber,
        region: profileDto.region,
        city: profileDto.city,
        address: profileDto.address,
      };

      return await this.profileModel.create(newProfile);
    }

    existingProfile.firstname = profileDto.firstname;
    existingProfile.lastname = profileDto.lastname;
    existingProfile.middleName = profileDto.middleName;
    existingProfile.phoneNumber = profileDto.phoneNumber;
    existingProfile.region = profileDto.region;
    existingProfile.city = profileDto.city;
    existingProfile.address = profileDto.address;
    await existingProfile.save();

    return existingProfile;
  }

  async getProfile(userId: number) {
    const existingProfile = await this.profileModel.findOne({
      where: { user: userId },
    });

    if (!existingProfile) {
      return null;
    }

    return existingProfile;
  }
}
