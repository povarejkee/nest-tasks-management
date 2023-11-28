import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

// todo вынести в отдельный файл:
const strongPasswordRegExp: RegExp =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export class UserCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(24)
  public username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(24)
  @Matches(strongPasswordRegExp, { message: 'Your password is too weak' })
  public password: string;
}
