import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class EnterCodeResetPasswordDto {
  @ApiProperty({
    example: 'example@mail.com',
    description: 'Адрес электронной почты пользователя',
  })
  @IsNotEmpty({ message: 'Email должен быть заполнен' })
  @IsString({ message: 'Email должен быть строкой' })
  readonly email: string;

  @ApiProperty({
    example: '2209',
    description: 'Код подтверждения',
  })
  @IsNotEmpty({ message: 'Код должен быть заполнен' })
  @IsString({ message: 'Код должен быть строкой' })
  readonly code: string;

  constructor(email: string, code: string) {
    this.email = email;
    this.code = code;
  }
}
