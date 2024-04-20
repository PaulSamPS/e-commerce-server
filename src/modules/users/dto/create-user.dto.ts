import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'example@mail.com',
    description: 'Адрес электронной почты пользователя',
  })
  @IsNotEmpty({ message: 'Email должен быть заполнен' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Неверный формат адреса электронной почты',
  })
  readonly email: string;

  @ApiProperty({
    example: 'user',
    description: 'Имя пользователя',
  })
  @IsNotEmpty({ message: 'Имя пользователя должно быть заполнено' })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/, {
    message:
      'Имя пользователя должно начинаться с буквы и содержать только буквы и цифры',
  })
  @MinLength(3, {
    message: 'Имя пользователя должно содержать минимум 3 символа',
  })
  readonly username: string;

  @ApiProperty({
    example: '12345',
    description: 'Пароль пользователя',
  })
  @IsNotEmpty({ message: 'Пароль должен быть заполнен' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(5, { message: 'Пароль должен содержать минимум 5 символов' })
  readonly password: string;

  constructor(email: string, username: string, password: string) {
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
