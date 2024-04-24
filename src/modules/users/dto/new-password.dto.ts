import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty({
    example: 'example@mail.com',
    description: 'Адрес электронной почты пользователя',
  })
  @IsNotEmpty({ message: 'Email должен быть заполнен' })
  @IsString({ message: 'Email должен быть строкой' })
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    minimum: 5,
    description: 'Пароль пользователя',
  })
  @IsNotEmpty({ message: 'Пароль должен быть заполнен' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(5, { message: 'Пароль должен содержать минимум 5 символов' })
  readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
