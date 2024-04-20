import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ActivateUserDto {
  @ApiProperty({
    example: 'example@mail.com',
    description: 'Email пользователя',
  })
  @IsNotEmpty({ message: 'Поле "email" должно быть заполнено' })
  @IsString({ message: 'Поле "email" должно быть строкой' })
  readonly email: string;

  @ApiProperty({
    example: '1234',
    minimum: 4,
    maximum: 4,
    description: 'Код активации (четыре цифры)',
  })
  @IsNotEmpty({ message: 'Поле "code" должно быть заполнено' })
  @Length(4, 4, { message: 'Код активации должен содержать четыре цифры' })
  @IsString({ message: 'Поле "code" должно быть строкой' })
  readonly code: string;

  constructor(email: string, code: string) {
    this.email = email;
    this.code = code;
  }
}
