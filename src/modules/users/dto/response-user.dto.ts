export class ResponseUserDto {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly username: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}
}
