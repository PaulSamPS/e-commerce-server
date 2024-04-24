import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SendCodeResetPasswordDto {
  @ApiProperty({
    example: 'example@mail.com',
    description: 'Адрес электронной почты пользователя',
  })
  @IsNotEmpty({ message: 'Email должен быть заполнен' })
  @IsString({ message: 'Email должен быть строкой' })
  readonly email: string;

  constructor(email: string) {
    this.email = email;
  }
}
